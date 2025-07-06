import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Settings, 
  Activity,
  Database,
  Globe,
  ArrowLeft,
  Save,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Info,
  Mail,
  Phone,
  MapPin,
  User,
  Lock,
  Building,
  Shield,
  Upload,
  FileText,
  RefreshCw,
  LucideIcon
} from 'lucide-react';

// Types et interfaces
type UserRole = 'client' | 'agent_sfd' | 'superviseur_sfd' | 'admin_sfd' | 'admin_platform';

type Region = 'Alibori' | 'Atacora' | 'Atlantique' | 'Borgou' | 'Collines' |
              'Couffo' | 'Donga' | 'Littoral' | 'Mono' | 'Ouémé' | 'Plateau' | 'Zou';

type SFDValue = 'clcam' | 'coopec' | 'fescoop' | 'vital_finance' | 'padme';

type DocumentType = 'idCard' | 'photo' | 'certification';

type Documents = {
  [key in DocumentType]: File | null;
}

interface FormData {
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: Region | '';
  profession: string;
  
  // Informations de compte
  role: UserRole;
  sfd: SFDValue | '';
  password: string;
  confirmPassword: string;
  
  // Options
  emailVerified: boolean;
  phoneVerified: boolean;
  sendWelcomeEmail: boolean;
  sendWelcomeSMS: boolean;
  requirePasswordChange: boolean;
  
  // Documents (pour certains rôles)
  documents: Documents;
  
  // Notes admin
  adminNotes: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface ValidationStatus {
  [key: string]: {
    isValid: boolean;
    message: string;
  };
}

interface RoleDefinition {
  value: UserRole;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  requiresSFD: boolean;
  requiresDocuments: boolean;
}

interface SFDOption {
  value: SFDValue;
  label: string;
}

interface RegionOption {
  value: Region;
  label: Region;
}

interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

interface DocumentConfig {
  key: DocumentType;
  label: string;
}

// Props des composants
interface InputFieldProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  icon?: LucideIcon;
  validation?: {
    isValid: boolean;
    message: string;
  };
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
  icon?: LucideIcon;
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  show: boolean;
  onToggle: () => void;
  validation?: {
    isValid: boolean;
    message: string;
  };
}

interface RoleCardProps {
  role: RoleDefinition;
  selected: boolean;
  onClick: () => void;
}

const CreateUser: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    profession: '',
    
    // Informations de compte
    role: 'client',
    sfd: '',
    password: '',
    confirmPassword: '',
    
    // Options
    emailVerified: false,
    phoneVerified: false,
    sendWelcomeEmail: true,
    sendWelcomeSMS: true,
    requirePasswordChange: true,
    
    // Documents (pour certains rôles)
    documents: {
      idCard: null,
      photo: null,
      certification: null
    },
    
    // Notes admin
    adminNotes: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({});

  const roles: RoleDefinition[] = [
    { 
      value: 'client', 
      label: 'Client', 
      description: 'Utilisateur standard qui peut rejoindre des tontines et gérer son épargne',
      icon: User,
      color: 'blue',
      requiresSFD: false,
      requiresDocuments: false
    },
    { 
      value: 'agent_sfd', 
      label: 'Agent SFD', 
      description: 'Valide les inscriptions, retraits et comptes épargne de son SFD',
      icon: Users,
      color: 'purple',
      requiresSFD: true,
      requiresDocuments: true
    },
    { 
      value: 'superviseur_sfd', 
      label: 'Superviseur SFD', 
      description: 'Gère les demandes de prêt et définit les taux de son SFD',
      icon: Shield,
      color: 'orange',
      requiresSFD: true,
      requiresDocuments: true
    },
    { 
      value: 'admin_sfd', 
      label: 'Administrateur SFD', 
      description: 'Gestion complète du SFD, création de tontines et validation finale',
      icon: Building,
      color: 'red',
      requiresSFD: true,
      requiresDocuments: true
    },
    { 
      value: 'admin_platform', 
      label: 'Administrateur Plateforme', 
      description: 'Accès complet à la gestion de la plateforme TontiFlex',
      icon: Settings,
      color: 'gray',
      requiresSFD: false,
      requiresDocuments: true
    }
  ];

  const sfds: SFDOption[] = [
    { value: 'clcam', label: 'CLCAM' },
    { value: 'coopec', label: 'Coopec Atlantique' },
    { value: 'fescoop', label: 'Fescoop' },
    { value: 'vital_finance', label: 'Vital Finance' },
    { value: 'padme', label: 'PADME Microfinance' }
  ];

  const regions: Region[] = [
    'Alibori', 'Atacora', 'Atlantique', 'Borgou', 'Collines',
    'Couffo', 'Donga', 'Littoral', 'Mono', 'Ouémé', 'Plateau', 'Zou'
  ];

  const documentConfigs: DocumentConfig[] = [
    { key: 'idCard', label: 'Pièce d\'identité' },
    { key: 'photo', label: 'Photo d\'identité' },
    { key: 'certification', label: 'Certification professionnelle' }
  ];

  const steps: Step[] = [
    { id: 1, title: 'Informations personnelles', icon: User },
    { id: 2, title: 'Rôle et accès', icon: Shield },
    { id: 3, title: 'Configuration', icon: Settings }
  ];

  const navItems: NavItem[] = [
    { icon: Activity, label: 'Vue d\'ensemble' },
    { icon: Users, label: 'Gestion utilisateurs', active: true },
    { icon: Building2, label: 'Gestion SFD' },
    { icon: TrendingUp, label: 'Analytics' },
    { icon: Database, label: 'Logs & Audit' },
    { icon: Globe, label: 'Intégrations' },
    { icon: Settings, label: 'Paramètres' },
  ];

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
    
    // Real-time validation
    validateField(field as string, value);
  };

  const validateField = (field: string, value: any): void => {
    let isValid = true;
    let message = '';

    switch(field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value as string);
        message = isValid ? 'Email valide' : 'Format email invalide';
        break;
      case 'phone':
        const phoneRegex = /^\+229\s?\d{8}$/;
        isValid = phoneRegex.test(value as string);
        message = isValid ? 'Numéro valide' : 'Format: +229 XXXXXXXX';
        break;
      case 'password':
        isValid = (value as string).length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value as string);
        message = isValid ? 'Mot de passe fort' : 'Min 8 caractères, maj, min, chiffre';
        break;
      case 'confirmPassword':
        isValid = value === formData.password;
        message = isValid ? 'Mots de passe identiques' : 'Les mots de passe ne correspondent pas';
        break;
    }

    setValidationStatus(prev => ({
      ...prev,
      [field]: { isValid, message }
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};
    
    switch(step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
        if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
        if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
        if (!formData.address) newErrors.address = 'L\'adresse est requise';
        break;
      case 2:
        if (!formData.role) newErrors.role = 'Le rôle est requis';
        const selectedRole = roles.find(r => r.value === formData.role);
        if (selectedRole?.requiresSFD && !formData.sfd) {
          newErrors.sfd = 'Le SFD est requis pour ce rôle';
        }
        if (!formData.password) newErrors.password = 'Le mot de passe est requis';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmez le mot de passe';
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (): void => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = (): void => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    
    // Simulation de création
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Utilisateur créé avec succès !');
    }, 2000);
  };

  const getSelectedRole = (): RoleDefinition | undefined => roles.find(r => r.value === formData.role);

  const handleStringChange = (value: string): string => value;

  const InputField: React.FC<InputFieldProps> = ({ 
    label, 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    error, 
    required = false,
    icon: Icon,
    validation
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-archivo font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 bg-white border rounded-lg font-archivo text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            error ? 'border-red-300' : validation?.isValid === false ? 'border-red-300' : validation?.isValid ? 'border-green-300' : 'border-gray-200'
          }`}
        />
        {validation?.isValid !== undefined && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {validation.isValid ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs font-archivo text-red-600">{error}</p>
      )}
      {validation?.message && !error && (
        <p className={`text-xs font-archivo ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
          {validation.message}
        </p>
      )}
    </div>
  );

  const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, options, error, required = false, icon: Icon }) => (
    <div className="space-y-2">
      <label className="block text-sm font-archivo font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 bg-white border rounded-lg font-archivo text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            error ? 'border-red-300' : 'border-gray-200'
          }`}
        >
          <option value="">Sélectionner...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-xs font-archivo text-red-600">{error}</p>
      )}
    </div>
  );

  const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, value, onChange, placeholder, rows = 3, error }) => (
    <div className="space-y-2">
      <label className="block text-sm font-archivo font-medium text-foreground">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 bg-white border rounded-lg font-archivo text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
      />
      {error && (
        <p className="text-xs font-archivo text-red-600">{error}</p>
      )}
    </div>
  );

  const PasswordField: React.FC<PasswordFieldProps> = ({ label, value, onChange, placeholder, error, required, show, onToggle, validation }) => (
    <div className="space-y-2">
      <label className="block text-sm font-archivo font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2 bg-white border rounded-lg font-archivo text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            error ? 'border-red-300' : validation?.isValid === false ? 'border-red-300' : validation?.isValid ? 'border-green-300' : 'border-gray-200'
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {show ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>
      {error && (
        <p className="text-xs font-archivo text-red-600">{error}</p>
      )}
      {validation?.message && !error && (
        <p className={`text-xs font-archivo ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
          {validation.message}
        </p>
      )}
    </div>
  );

  const RoleCard: React.FC<RoleCardProps> = ({ role, selected, onClick }) => {
    const Icon = role.icon;
    const colorClass = `text-${role.color}-500`;
    const bgClass = `bg-${role.color}-100`;
    
    return (
      <div
        onClick={onClick}
        className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
          selected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${selected ? 'bg-primary/10' : bgClass}`}>
            <Icon className={`w-5 h-5 ${selected ? 'text-primary' : colorClass}`} />
          </div>
          <div className="flex-1">
            <h4 className="font-archivo font-medium text-foreground">{role.label}</h4>
            <p className="font-archivo text-xs text-muted-foreground mt-1">{role.description}</p>
            <div className="flex items-center space-x-4 mt-2">
              {role.requiresSFD && (
                <span className="text-xs font-archivo text-orange-600 bg-orange-100 px-2 py-1 rounded">
                  Requiert SFD
                </span>
              )}
              {role.requiresDocuments && (
                <span className="text-xs font-archivo text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Documents requis
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Step1: React.FC = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Info className="w-4 h-4 text-blue-600" />
          <p className="font-archivo text-sm font-medium text-blue-800">Informations personnelles</p>
        </div>
        <p className="font-archivo text-xs text-blue-600">
          Saisissez les informations personnelles du nouvel utilisateur
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Prénom"
          value={formData.firstName}
          onChange={(value) => updateField('firstName', value)}
          placeholder="Jean"
          error={errors.firstName}
          required
          icon={User}
        />
        <InputField
          label="Nom"
          value={formData.lastName}
          onChange={(value) => updateField('lastName', value)}
          placeholder="Dupont"
          error={errors.lastName}
          required
          icon={User}
        />
        <InputField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => updateField('email', value)}
          placeholder="jean.dupont@email.com"
          error={errors.email}
          icon={Mail}
          validation={validationStatus.email}
        />
        <InputField
          label="Téléphone"
          type="tel"
          value={formData.phone}
          onChange={(value) => updateField('phone', value)}
          placeholder="+229 97 12 34 56"
          error={errors.phone}
          required
          icon={Phone}
          validation={validationStatus.phone}
        />
        <InputField
          label="Adresse"
          value={formData.address}
          onChange={(value) => updateField('address', value)}
          placeholder="Cotonou, Akpakpa, Rue des Palmiers"
          error={errors.address}
          required
          icon={MapPin}
        />
        <InputField
          label="Ville"
          value={formData.city}
          onChange={(value) => updateField('city', value)}
          placeholder="Cotonou"
          icon={MapPin}
        />
        <SelectField
          label="Région"
          value={formData.region}
          onChange={(value) => updateField('region', value as Region)}
          options={regions.map(region => ({ value: region, label: region }))}
          icon={MapPin}
        />
        <InputField
          label="Profession"
          value={formData.profession}
          onChange={(value) => updateField('profession', value)}
          placeholder="Commerçant"
        />
      </div>
    </div>
  );

  const Step2: React.FC = () => {
    const selectedRole = getSelectedRole();
    
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-green-600" />
            <p className="font-archivo text-sm font-medium text-green-800">Rôle et accès</p>
          </div>
          <p className="font-archivo text-xs text-green-600">
            Définissez le rôle et les permissions de l'utilisateur
          </p>
        </div>

        <div>
          <h3 className="text-lg font-chillax font-semibold text-foreground mb-4">Sélectionnez un rôle</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {roles.map((role) => (
              <RoleCard
                key={role.value}
                role={role}
                selected={formData.role === role.value}
                onClick={() => updateField('role', role.value)}
              />
            ))}
          </div>
          {errors.role && (
            <p className="text-xs font-archivo text-red-600 mt-2">{errors.role}</p>
          )}
        </div>

        {selectedRole?.requiresSFD && (
          <SelectField
            label="SFD d'affectation"
            value={formData.sfd}
            onChange={(value) => updateField('sfd', value as SFDValue)}
            options={sfds}
            error={errors.sfd}
            required
            icon={Building2}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PasswordField
            label="Mot de passe"
            value={formData.password}
            onChange={(value) => updateField('password', value)}
            placeholder="••••••••"
            error={errors.password}
            required
            show={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            validation={validationStatus.password}
          />
          <PasswordField
            label="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChange={(value) => updateField('confirmPassword', value)}
            placeholder="••••••••"
            error={errors.confirmPassword}
            required
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            validation={validationStatus.confirmPassword}
          />
        </div>
      </div>
    );
  };

  const Step3: React.FC = () => {
    const selectedRole = getSelectedRole();
    
    return (
      <div className="space-y-6">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            <p className="font-archivo text-sm font-medium text-purple-800">Configuration finale</p>
          </div>
          <p className="font-archivo text-xs text-purple-600">
            Options de compte et paramètres additionnels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-archivo font-medium text-foreground">Options de vérification</h4>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.emailVerified}
                onChange={(e) => updateField('emailVerified', e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="font-archivo text-sm text-foreground">Email vérifié</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.phoneVerified}
                onChange={(e) => updateField('phoneVerified', e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="font-archivo text-sm text-foreground">Téléphone vérifié</span>
            </label>
          </div>

          <div className="space-y-4">
            <h4 className="font-archivo font-medium text-foreground">Notifications de bienvenue</h4>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.sendWelcomeEmail}
                onChange={(e) => updateField('sendWelcomeEmail', e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="font-archivo text-sm text-foreground">Envoyer email de bienvenue</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.sendWelcomeSMS}
                onChange={(e) => updateField('sendWelcomeSMS', e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="font-archivo text-sm text-foreground">Envoyer SMS de bienvenue</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.requirePasswordChange}
                onChange={(e) => updateField('requirePasswordChange', e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="font-archivo text-sm text-foreground">Forcer changement mot de passe</span>
            </label>
          </div>
        </div>

        {selectedRole?.requiresDocuments && (
          <div>
            <h4 className="font-archivo font-medium text-foreground mb-4">Documents requis</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {documentConfigs.map((doc) => (
                <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-archivo text-sm font-medium text-foreground">{doc.label}</p>
                    <button className="flex items-center space-x-2 px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                      <Upload className="w-3 h-3" />
                      <span className="font-archivo text-xs">Upload</span>
                    </button>
                  </div>
                  <p className="font-archivo text-xs text-muted-foreground">
                    {formData.documents[doc.key] ? 'Document téléchargé' : 'Aucun fichier'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <TextAreaField
          label="Notes administratives"
          value={formData.adminNotes}
          onChange={(value) => updateField('adminNotes', value)}
          placeholder="Notes internes concernant cet utilisateur..."
          rows={4}
        />

        {/* Récapitulatif */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="font-archivo font-medium text-foreground mb-4">Récapitulatif</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-archivo text-xs text-muted-foreground">Nom complet</p>
              <p className="font-archivo text-sm font-medium">{formData.firstName} {formData.lastName}</p>
            </div>
            <div>
              <p className="font-archivo text-xs text-muted-foreground">Rôle</p>
              <p className="font-archivo text-sm font-medium">{selectedRole?.label}</p>
            </div>
            <div>
              <p className="font-archivo text-xs text-muted-foreground">Email</p>
              <p className="font-archivo text-sm font-medium">{formData.email || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="font-archivo text-xs text-muted-foreground">Téléphone</p>
              <p className="font-archivo text-sm font-medium">{formData.phone}</p>
            </div>
            {selectedRole?.requiresSFD && (
              <div>
                <p className="font-archivo text-xs text-muted-foreground">SFD</p>
                <p className="font-archivo text-sm font-medium">
                  {sfds.find(s => s.value === formData.sfd)?.label || 'Non sélectionné'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-accent/20">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-primary shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-chillax font-bold text-white">TontiFlex</h1>
          <p className="text-sm font-archivo text-primary-foreground/80">Admin Plateforme</p>
        </div>
        
        <nav className="mt-8 px-4 space-y-2">
          <div className="bg-primary-foreground/10 rounded-lg p-3 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-archivo font-medium text-white">Admin Principal</p>
                <p className="text-xs font-archivo text-primary-foreground/80">En ligne</p>
              </div>
            </div>
          </div>

          {navItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-archivo text-sm transition-colors ${
                item.active 
                  ? 'bg-primary-foreground/20 text-white' 
                  : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-primary" />
              </button>
              <div>
                <h1 className="text-3xl font-chillax font-bold text-foreground">
                  Créer un nouvel utilisateur
                </h1>
                <p className="font-archivo text-muted-foreground">
                  Ajoutez un nouvel utilisateur à la plateforme TontiFlex
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    step.id === currentStep 
                      ? 'bg-primary border-primary text-white' 
                      : step.id < currentStep 
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    {step.id < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-archivo font-medium ${
                      step.id === currentStep 
                        ? 'text-primary' 
                        : step.id < currentStep 
                          ? 'text-green-600'
                          : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`mx-4 h-0.5 w-16 ${
                      step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-lg p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-chillax font-semibold text-foreground mb-2">
                {steps[currentStep - 1].title}
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {currentStep === 1 && <Step1 />}
            {currentStep === 2 && <Step2 />}
            {currentStep === 3 && <Step3 />}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-archivo text-sm transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              {currentStep === steps.length ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>{isSubmitting ? 'Création...' : 'Créer l\'utilisateur'}</span>
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <span>Suivant</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;