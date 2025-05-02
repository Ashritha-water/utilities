const PolicyCategory = require('./PolicyCategory');
const Policy = require('./Policy');
const PolicyVersion = require('./PolicyVersion');
const TariffPlan = require('./TariffPlan');
const TariffComponent = require('./TariffComponent');
const RuleGroup = require('./RuleGroup');
const Rule = require('./Rule');
const RuleException = require('./RuleException');
const RuleEvaluationContext = require('./RuleEvaluationContext');
const RuleEvaluation = require('./RuleEvaluation');
const RuleExecutionStats = require('./RuleExecutionStats');

// Policy Management Relationships
Policy.belongsTo(PolicyCategory, { foreignKey: 'category_id' });
PolicyCategory.hasMany(Policy, { foreignKey: 'category_id' });

Policy.hasMany(PolicyVersion, { foreignKey: 'policy_id' });
PolicyVersion.belongsTo(Policy, { foreignKey: 'policy_id' });

// Rule Management Relationships
Policy.hasMany(RuleGroup, { foreignKey: 'policy_id' });
RuleGroup.belongsTo(Policy, { foreignKey: 'policy_id' });

RuleGroup.hasMany(Rule, { foreignKey: 'rule_group_id' });
Rule.belongsTo(RuleGroup, { foreignKey: 'rule_group_id' });

Policy.hasMany(Rule, { foreignKey: 'policy_id' });
Rule.belongsTo(Policy, { foreignKey: 'policy_id' });

Rule.hasMany(RuleException, { foreignKey: 'rule_id' });
RuleException.belongsTo(Rule, { foreignKey: 'rule_id' });

Rule.hasOne(RuleExecutionStats, { foreignKey: 'rule_id' });
RuleExecutionStats.belongsTo(Rule, { foreignKey: 'rule_id' });

// Tariff Management Relationships
TariffPlan.hasMany(TariffComponent, { foreignKey: 'tariff_plan_id' });
TariffComponent.belongsTo(TariffPlan, { foreignKey: 'tariff_plan_id' });

// Rule Evaluation Relationships
Rule.hasMany(RuleEvaluation, { foreignKey: 'rule_id' });
RuleEvaluation.belongsTo(Rule, { foreignKey: 'rule_id' });

Policy.hasMany(RuleEvaluation, { foreignKey: 'policy_id' });
RuleEvaluation.belongsTo(Policy, { foreignKey: 'policy_id' });

module.exports = {
  PolicyCategory,
  Policy,
  PolicyVersion,
  TariffPlan,
  TariffComponent,
  RuleGroup,
  Rule,
  RuleException,
  RuleEvaluationContext,
  RuleEvaluation,
  RuleExecutionStats
}; 