import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-surface-400 text-sm font-medium">{title}</h3>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-400" />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between mt-auto">
        <p className="text-3xl font-display font-bold text-white">{value}</p>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
