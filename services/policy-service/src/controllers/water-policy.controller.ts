import { Request, Response } from 'express';
import { Policy, SlabRate, BulkAgreement, Category, PipeSize, PolicyDefinition } from '../models';
import { Op } from 'sequelize';

export class WaterPolicyController {


  async fetchPolicyDetails(req: Request, res: Response) {
    try {
      console.log("Hiii")
      const { utilityId, categoryId } = req.query;

      if (!utilityId || !categoryId) {
        return res.status(400).json({ error: 'Missing required parameters (utilityId, categoryId)' });
      }

      // Fetch the active policy for the provided utilityId and categoryId
      const policy = await Policy.findOne({
        where: { 
          utilityId: Number(utilityId),
          isActive: true
        },
        include: [
          {
            model: SlabRate,
            where: { categoryId: Number(categoryId) },
            include: [{ model: Category }],
          },
          // {
          //   model: BulkAgreement,
          //   include: [{ model: Category }],
          // },
          {
            model: PipeSize,
          }
        ]
      });

      if (!policy) {
        return res.status(404).json({ error: 'No policy found for the given utilityId and categoryId' });
      }

      res.json(policy);  // Return the policy details
    } catch (error) {
      console.error('Error fetching policy details:', error);
      res.status(200).json({ error: error });
    }
  }
  // Get all water policies with their associated rates
  async getPolicies(req: Request, res: Response) {
    try {
      const { utilityId } = req.query;
      const policies = await Policy.findAll({
        where: { utilityId: Number(utilityId) },
        include: [
          {
            model: SlabRate,
            include: [{ model: Category }],
          },
          {
            model: BulkAgreement,
            include: [{ model: Category }],
          },
          {
            model: PipeSize,
          }
        ],
        order: [['startDate', 'DESC']],
      });
      res.json(policies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch policies' });
    }
  }

  // Get policy by ID with all associated rates
  async getPolicyById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const policy = await Policy.findByPk(id, {
        include: [
          {
            model: SlabRate,
            include: [{ model: Category }],
          },
          {
            model: BulkAgreement,
            include: [{ model: Category }],
          },
        ],
      });
      if (!policy) {
        return res.status(404).json({ error: 'Policy not found' });
      }
      res.json(policy);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch policy' });
    }
  }

  // Get current active policy
  async getCurrentPolicy(req: Request, res: Response) {
    try {
      const currentDate = new Date();
      const policy = await Policy.findOne({
        where: {
          startDate: { [Op.lte]: currentDate },
          endDate: { [Op.gte]: currentDate },
          isActive: true,
        },
        include: [
          {
            model: SlabRate,
            include: [{ model: Category }],
          },
          {
            model: BulkAgreement,
            include: [{ model: Category }],
          },
        ],
      });
      if (!policy) {
        return res.status(404).json({ error: 'No active policy found' });
      }
      res.json(policy);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch current policy' });
    }
  }

  // Create new policy with dynamic attributes
  async createPolicy(req: Request, res: Response) {
    try {
      console.log("Creating policy with data:", JSON.stringify(req.body, null, 2));

      const { utilityId, policyDefinitionId, data } = req.body;

      // Get policy definition
      const policyDefinition = await PolicyDefinition.findByPk(policyDefinitionId);
      if (!policyDefinition) {
        console.log("Policy definition not found:", policyDefinitionId);
        return res.status(404).json({ error: 'Policy definition not found' });
      }
      console.log("Found policy definition:", JSON.stringify(policyDefinition.toJSON(), null, 2));

      // Start transaction
      const result = await Policy.sequelize!.transaction(async (t) => {
        try {
          // Create base policy
          const newPolicy = await Policy.create({
            utilityId,
            policyDefinitionId,
            name: data.name,
            period: data.period,
            startDate: data.startDate,
            endDate: data.endDate,
            isActive: data.isActive,
            description: data.description || '',
            category: data.category || 'D',
            rules: data.rules || {} 
          }, { transaction: t });
          console.log("Created base policy:", JSON.stringify(newPolicy.toJSON(), null, 2));

          // Handle different utilities
          switch (utilityId) {
            case 1: // Water Utility
              // Create slab rates
              if (data.slabRates) {
                console.log("Creating slab rates:", JSON.stringify(data.slabRates, null, 2));
                await SlabRate.bulkCreate(
                  data.slabRates.map((rate: any) => ({
                    ...rate,
                    policyId: newPolicy.id,
                  })),
                  { transaction: t }
                );
              }
              // Create bulk agreements
              if (data.bulkAgreements) {
                console.log("Creating bulk agreements:", JSON.stringify(data.bulkAgreements, null, 2));
                await BulkAgreement.bulkCreate(
                  data.bulkAgreements.map((agreement: any) => ({
                    ...agreement,
                    policyId: newPolicy.id,
                  })),
                  { transaction: t }
                );
              }
              // Create pipe sizes
              if (data.pipeSizes) {
                console.log("Creating pipe sizes:", JSON.stringify(data.pipeSizes, null, 2));
                await PipeSize.bulkCreate(
                  data.pipeSizes.map((size: any) => ({
                    ...size,
                    policyId: newPolicy.id,
                  })),
                  { transaction: t }
                );
              }
              break;

            case 2: // Electricity Utility
              // Add electricity-specific logic here
              if (data.demandCharges) {
                // Handle demand charges
              }
              if (data.powerFactorRates) {
                // Handle power factor rates
              }
              break;

            case 3: // Gas Utility
              // Add gas-specific logic here
              if (data.pressureCharges) {
                // Handle pressure charges
              }
              if (data.calorificValues) {
                // Handle calorific values
              }
              break;

            default:
              throw new Error('Unsupported utility type');
          }

          return newPolicy;
        } catch (error) {
          console.error("Error in transaction:", error);
          throw error;
        }
      });

      res.status(201).json(result);
    } catch (error: any) {
      console.error("Failed to create policy:", error);
      res.status(500).json({ error: 'Failed to create policy', details: error.message });
    }
  }

  // Update policy with dynamic attributes
  async updatePolicy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { data } = req.body;

      const policy = await Policy.findByPk(id);
      if (!policy) {
        return res.status(404).json({ error: 'Policy not found' });
      }

      const policyDefinition = await PolicyDefinition.findByPk(policy.policyDefinitionId);
      if (!policyDefinition) {
        return res.status(404).json({ error: 'Policy definition not found' });
      }

      // Start transaction
      const result = await Policy.sequelize!.transaction(async (t) => {
        // Update base policy
        await Policy.update({
          name: data.name,
          period: data.period,
          startDate: data.startDate,
          endDate: data.endDate,
          isActive: data.isActive
        }, {
          where: { id },
          transaction: t
        });

        // Dynamically update related records
        for (const attr of policyDefinition.structure.attributes) {
          if (data[attr.name]) {
            switch (attr.type) {
              case 'reference':
                if (attr.referenceModel === 'slab_rates') {
                  await SlabRate.destroy({ where: { policyId: id }, transaction: t });
                  await SlabRate.bulkCreate(
                    data[attr.name].map((rate: any) => ({
                      ...rate,
                      policyId: id,
                    })),
                    { transaction: t }
                  );
                } else if (attr.referenceModel === 'bulk_agreements') {
                  await BulkAgreement.destroy({ where: { policyId: id }, transaction: t });
                  await BulkAgreement.bulkCreate(
                    data[attr.name].map((agreement: any) => ({
                      ...agreement,
                      policyId: id,
                    })),
                    { transaction: t }
                  );
                } else if (attr.referenceModel === 'pipe_sizes') {
                  await PipeSize.destroy({ where: { policyId: id }, transaction: t });
                  await PipeSize.bulkCreate(
                    data[attr.name].map((size: any) => ({
                      ...size,
                      policyId: id,
                    })),
                    { transaction: t }
                  );
                }
                break;
              // Add other attribute types as needed
            }
          }
        }

        return await Policy.findByPk(id, {
          include: [
            { model: SlabRate, include: [{ model: Category }] },
            { model: BulkAgreement, include: [{ model: Category }] },
            { model: PipeSize }
          ],
          transaction: t
        });
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update policy' });
    }
  }

  // Delete policy and its associated rates
  async deletePolicy(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Start transaction
      await Policy.sequelize!.transaction(async (t) => {
        // Delete associated rates and agreements
        await SlabRate.destroy({ where: { policyId: id }, transaction: t });
        await BulkAgreement.destroy({ where: { policyId: id }, transaction: t });
        
        // Delete policy
        const deleted = await Policy.destroy({
          where: { id },
          transaction: t,
        });

        if (!deleted) {
          throw new Error('Policy not found');
        }
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete policy' });
    }
  }

  // Get policy by date range
  async getPolicyByDate(req: Request, res: Response) {
    try {
      const { date } = req.query;
      const targetDate = new Date(date as string);

      const policy = await Policy.findOne({
        where: {
          startDate: { [Op.lte]: targetDate },
          endDate: { [Op.gte]: targetDate },
          isActive: true,
        },
        include: [
          {
            model: SlabRate,
            include: [{ model: Category }],
          },
          {
            model: BulkAgreement,
            include: [{ model: Category }],
          },
        ],
      });

      if (!policy) {
        return res.status(404).json({ error: 'No policy found for the given date' });
      }

      res.json(policy);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch policy' });
    }
  }
} 