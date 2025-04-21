import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Consumer from '../models/consumer.model';
import ConsumerCategory from '../models/consumer-category.model';
import OrganizationUnit from '../models/organization-unit.model';
import sequelize from 'sequelize';
import Connection from '../models/connection.model';

export class ConsumerQueryController {
  // Get consumers by pipe size (assuming pipe size is in attributes)
  public async getConsumersByPipeSize(req: Request, res: Response) {
    try {
      const { pipeSize } = req.query;
  
      const consumers = await Consumer.findAll({
        include: [
          {
            model: Connection,
            as: 'connections',
            where: {
              pipeSize: pipeSize
            }
          }
        ]
      });

      // console.log("consumers",consumers);
  
      res.json(consumers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch consumers by pipe size' });
    }
  }
  

  // Get consumers by organization hierarchy
  public async getConsumersByHierarchy(req: Request, res: Response) {
    try {
      const { unitId } = req.query;
      
      if (!unitId) {
        return res.status(400).json({ error: 'Organization unit ID is required' });
      }

      // First, get the target unit and its level
      const unit = await OrganizationUnit.findByPk(unitId as string);
      if (!unit) {
        return res.status(404).json({ error: 'Organization unit not found' });
      }

      // Get all child units recursively
      const getAllChildUnitIds = async (parentId: string): Promise<string[]> => {
        const children = await OrganizationUnit.findAll({
          where: { parentId }
        });
        
        const childIds = children.map(child => child.unitId);
        const descendantIds = await Promise.all(
          children.map(child => getAllChildUnitIds(child.unitId))
        );
        
        return [parentId, ...childIds, ...descendantIds.flat()];
      };

      // Get all unit IDs in the hierarchy
      const unitIds = await getAllChildUnitIds(unitId as string);

      // Get all consumers in these units
      const consumers = await Consumer.findAll({
        where: {
          organizationUnitId: {
            [Op.in]: unitIds
          }
        },
        include: [
          {
            model: OrganizationUnit,
            as: 'organizationUnit',
            attributes: ['unitId', 'name', 'code', 'type', 'level']
          },
          {
            model: ConsumerCategory,
            as: 'category'
          }
        ]
      });

      return res.json(consumers);
    } catch (error) {
      console.error('Error fetching consumers by hierarchy:', error);
      return res.status(500).json({ error: 'Failed to fetch consumers by hierarchy' });
    }
  }

  // Get hierarchy statistics
  public async getHierarchyStats(req: Request, res: Response) {
    try {
      const { unitId } = req.query;
      
      if (!unitId) {
        return res.status(400).json({ error: 'Organization unit ID is required' });
      }

      // Get all child units recursively (reusing logic from above)
      const getAllChildUnitIds = async (parentId: string): Promise<string[]> => {
        const children = await OrganizationUnit.findAll({
          where: { parentId }
        });
        
        const childIds = children.map(child => child.unitId);
        const descendantIds = await Promise.all(
          children.map(child => getAllChildUnitIds(child.unitId))
        );
        
        return [parentId, ...childIds, ...descendantIds.flat()];
      };

      const unitIds = await getAllChildUnitIds(unitId as string);

      // Get statistics
      const stats = await Consumer.findAll({
        where: {
          organizationUnitId: {
            [Op.in]: unitIds
          }
        },
        attributes: [
          'organizationUnitId',
          'categoryId',
          [sequelize.fn('COUNT', sequelize.col('consumerId')), 'count']
        ],
        include: [
          {
            model: OrganizationUnit,
            as: 'organizationUnit',
            attributes: ['name', 'code', 'type', 'level']
          },
          {
            model: ConsumerCategory,
            as: 'category',
            attributes: ['name']
          }
        ],
        group: ['organizationUnitId', 'categoryId', 'organizationUnit.unitId', 'category.categoryId']
      });

      return res.json(stats);
    } catch (error) {
      console.error('Error fetching hierarchy statistics:', error);
      return res.status(500).json({ error: 'Failed to fetch hierarchy statistics' });
    }
  }

  // Get consumers by category
  public async getConsumersByCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      console.log("categoryId",categoryId)
      const consumers = await Consumer.findAll({
        where: { categoryId },
        include: [{ model: ConsumerCategory, as: 'category' }]
      });
      console.log("consumers",consumers);
      return res.json(consumers);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch consumers by category'+error });
    }
  }



  public async getConsumersByPipeSizeAndCategory(req: Request, res: Response) {
    try {
      const { pipeSize, categoryId } = req.query;
  
      const consumerWhereClause: any = {};
      if (categoryId) {
        consumerWhereClause.categoryId = categoryId;
      }
  
      const connectionWhereClause: any = {};
      if (pipeSize) {
        connectionWhereClause.pipeSize = pipeSize;
      }
  
      const consumers = await Consumer.findAll({
        where: consumerWhereClause,
        include: [
          {
            model: ConsumerCategory,
            as: 'category'
          },
          {
            model: Connection,
            as: 'connections',
            where: Object.keys(connectionWhereClause).length ? connectionWhereClause : undefined
          }
        ]
      });
  
      return res.json(consumers);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch consumers by pipe size and category: ' + error });
    }
  }
  

}
