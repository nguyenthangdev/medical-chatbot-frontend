import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { getPasswordChecks, getPasswordStrength, strengthConfig } from '../../validations/Client/auth.validation';

const PasswordStrength = ({ password = '', error }) => {
  const strength = getPasswordStrength(password);
  const config = strengthConfig[strength];
  const checks = getPasswordChecks(password);

  return (
    <div className="mt-3 space-y-3">
      <div className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-1 rounded-full transition-colors"
            style={{ backgroundColor: item <= strength ? config.color : '#e5e7eb' }}
          />
        ))}
      </div>

      {config.label && (
        <p className="text-sm font-semibold" style={{ color: config.color }}>
          {config.label}
        </p>
      )}

      <div className="space-y-2">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center gap-2 text-sm font-medium ${check.valid ? 'text-emerald-700' : 'text-slate-500'}`}
          >
            {check.valid ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-slate-300" />}
            {check.label}
          </div>
        ))}
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm font-medium text-rose-600">
          <AlertCircle size={16} />
          {error.message}
        </p>
      )}
    </div>
  );
};

export default PasswordStrength;
