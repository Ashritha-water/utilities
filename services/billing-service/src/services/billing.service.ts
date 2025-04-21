import axios from 'axios';
import BillingRecord from '../models/billing.model';

const POLICY_SERVICE_URL = 'http://localhost:3001/api';

export interface PolicyRule {
    type: string;
    rate: number;
    unit?: string;
    condition?: { connectionType?: string };
}

export interface PolicyDetails {
    id: number;
    utilityId: number;
    categoryId: number;
    rules: Record<string, any>;
    SlabRates: { startUnit: number; endUnit: number; rate: number }[];
    PipeSizes: { size: number; rate: number }[];
}

const fetchPolicyDetails = async (utilityId: number, categoryId: number): Promise<PolicyDetails | null> => {
    try {
        console.log("Fetching policy details for Utility:", utilityId, "Category:", categoryId);
        const response = await axios.get(`${POLICY_SERVICE_URL}/policies/policy?utilityId=${utilityId}&categoryId=${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching policy details:', error);
        return null;
    }
};

export const calculateAndStoreBill = async (
    consumerId: number, 
    utilityId: number, 
    categoryId: number, 
    consumption: number, 
    // connectionType: string, 
    pipeSize?: number
) => {
    const policy = await fetchPolicyDetails(utilityId, categoryId);
    if (!policy) throw new Error('No tariff policy found');

    let consumptionCharge = 0;
    let pipeSizeCharge = 0;
    let minBillCharge = 0;
    let sewerageCess = 0;
    let serviceCharge = 0;

    for (const slab of policy.SlabRates) {
        if (consumption >= slab.startUnit && consumption <= slab.endUnit) {
            consumptionCharge = consumption * slab.rate;
            break;
        }
    }

    if (pipeSize) {
        const matchingPipe = policy.PipeSizes.find(p => p.size === pipeSize);
        if (matchingPipe) {
            pipeSizeCharge = matchingPipe.rate;
        }
    }


    if (policy.rules.minimumBill) {
        minBillCharge = policy.rules.minimumBill.amount ?? 0;
    }

    if (policy.rules.sewerageCess) {
    // if (policy.rules.sewerageCess && policy.rules.sewerageCess.condition?.connectionType === connectionType) {
        sewerageCess = ((Math.max(consumptionCharge, pipeSizeCharge, minBillCharge)) * (policy.rules.sewerageCess.value ?? 0)) / 100;
    }

    const waterCess = Math.max(consumptionCharge, pipeSizeCharge, minBillCharge);

    if (policy.rules.serviceCharge?.type === 'slab' && policy.rules.serviceCharge.slabs) {
        for (const slab of policy.rules.serviceCharge.slabs) {
            const [min, max] = slab.range;
            if (waterCess + sewerageCess >= min && (max === null || waterCess + sewerageCess <= max)) {
                serviceCharge = slab.charge;
                break;
            }
        }
    }


    const totalCharge = waterCess + sewerageCess + serviceCharge;

    const billData = {
        consumerId: consumerId,        
        utilityId: utilityId,
        policyId: policy.id,
        categoryId: categoryId,
        consumption: consumption,
        totalAmount: totalCharge,
        details: {       
            waterCess: waterCess,
            sewerageCess: sewerageCess,
            serviceCharge: serviceCharge,
            slabRatesUsed: policy.SlabRates,
            pipeSizeRateUsed: pipeSizeCharge
        },
    };

    return await BillingRecord.create(billData);
};



