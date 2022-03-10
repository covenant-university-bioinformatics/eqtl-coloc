import * as mongoose from 'mongoose';

export enum AnalysisType {
  QUANTIFICATION = 'quant',
  CASECONTROL = 'cc',
}

export enum TISSUEOptions {
  Adipose_Subcutaneous = 'Adipose_Subcutaneous',
  Adipose_Visceral_Omentum = 'Adipose_Visceral_Omentum',
  Adrenal_Gland = 'Adrenal_Gland',
  Artery_Aorta = 'Artery_Aorta',
  Artery_Coronary = 'Artery_Coronary',
  Artery_Tibial = 'Artery_Tibial',
  Brain_Amygdala = 'Brain_Amygdala',
  Brain_Anterior_cingulate_cortex_BA24 = 'Brain_Anterior_cingulate_cortex_BA24',
  Brain_Caudate_basal_ganglia = 'Brain_Caudate_basal_ganglia',
  Brain_Cerebellar_Hemisphere = 'Brain_Cerebellar_Hemisphere',
  Brain_Cerebellum = 'Brain_Cerebellum',
  Brain_Cortex = 'Brain_Cortex',
  Brain_Frontal_Cortex_BA9 = 'Brain_Frontal_Cortex_BA9',
  Brain_Hippocampus = 'Brain_Hippocampus',
  Brain_Hypothalamus = 'Brain_Hypothalamus',
  Brain_Nucleus_accumbens_basal_ganglia = 'Brain_Nucleus_accumbens_basal_ganglia',
  Brain_Putamen_basal_ganglia = 'Brain_Putamen_basal_ganglia',
  Brain_Spinal_cord_cervical_c_1 = 'Brain_Spinal_cord_cervical_c_1',
  Brain_Substantia_nigra = 'Brain_Substantia_nigra',
  Breast_Mammary_Tissue = 'Breast_Mammary_Tissue',
  Cells_Cultured_fibroblasts = 'Cells_Cultured_fibroblasts',
  Cells_EBV_transformed_lymphocytes = 'Cells_EBV_transformed_lymphocytes',
  Colon_Sigmoid = 'Colon_Sigmoid',
  Colon_Transverse = 'Colon_Transverse',
  Esophagus_Gastroesophageal_Junction = 'Esophagus_Gastroesophageal_Junction',
  Esophagus_Mucosa = 'Esophagus_Mucosa',
  Esophagus_Muscularis = 'Esophagus_Muscularis',
  Heart_Atrial_Appendage = 'Heart_Atrial_Appendage',
  Heart_Left_Ventricle = 'Heart_Left_Ventricle',
  Kidney_Cortex = 'Kidney_Cortex',
  Liver = 'Liver',
  Lung = 'Lung',
  Minor_Salivary_Gland = 'Minor_Salivary_Gland',
  Muscle_Skeletal = 'Muscle_Skeletal',
  Nerve_Tibial = 'Nerve_Tibial',
  Ovary = 'Ovary',
  Pancreas = 'Pancreas',
  Pituitary = 'Pituitary',
  Prostate = 'Prostate',
  Skin_Not_Sun_Exposed_Suprapubic = 'Skin_Not_Sun_Exposed_Suprapubic',
  Skin_Sun_Exposed_Lower_leg = 'Skin_Sun_Exposed_Lower_leg',
  Small_Intestine_Terminal_Ileum = 'Small_Intestine_Terminal_Ileum',
  Spleen = 'Spleen',
  Stomach = 'Stomach',
  Testis = 'Testis',
  Thyroid = 'Thyroid',
  Uterus = 'Uterus',
  Vagina = 'Vagina',
  Whole_Blood = 'Whole_Blood',
}

//Interface that describe the properties that are required to create a new job
interface EqtlColocAttrs {
  job: string;
  useTest: string;
  marker_name: string;
  beta?: string;
  slope_se?: string;
  p_value: string;
  GTEX8tissue: TISSUEOptions;
  p_one: string;
  p_two: string;
  p_twelve: string;
  type: AnalysisType;
  s_prop: string;
}

// An interface that describes the extra properties that a eqtl model has
//collection level methods
interface EqtlColocModel extends mongoose.Model<EqtlColocDoc> {
  build(attrs: EqtlColocAttrs): EqtlColocDoc;
}

//An interface that describes a properties that a document has
export interface EqtlColocDoc extends mongoose.Document {
  id: string;
  version: number;
  useTest: boolean;
  marker_name: number;
  beta?: number;
  slope_se?: number;
  p_value: number;
  GTEX8tissue: TISSUEOptions;
  p_one: string;
  p_two: string;
  p_twelve: string;
  type: AnalysisType;
  s_prop: number;
}

const EqtlColocSchema = new mongoose.Schema<EqtlColocDoc, EqtlColocModel>(
  {
    useTest: {
      type: Boolean,
      trim: true,
    },
    marker_name: {
      type: Number,
      trim: true,
    },
    beta: {
      type: Number,
      trim: true,
      default: null,
    },
    slope_se: {
      type: Number,
      trim: true,
      default: null,
    },
    p_value: {
      type: Number,
      trim: true,
    },
    GTEX8tissue: {
      type: String,
      enum: [...Object.values(TISSUEOptions)],
      trim: true,
    },
    p_one: {
      type: Number,
      trim: true,
    },
    p_two: {
      type: Number,
      trim: true,
    },
    p_twelve: {
      type: Number,
      trim: true,
    },
    s_prop: {
      type: Number,
      trim: true,
    },
    type: {
      type: String,
      enum: [AnalysisType.QUANTIFICATION, AnalysisType.CASECONTROL],
      trim: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EqtlColocJob',
      required: true,
    },
    version: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        // delete ret._id;
        // delete ret.__v;
      },
    },
  },
);

//increments version when document updates
EqtlColocSchema.set('versionKey', 'version');

//collection level methods
EqtlColocSchema.statics.build = (attrs: EqtlColocAttrs) => {
  return new EqtlColocModel(attrs);
};

//create mongoose model
const EqtlColocModel = mongoose.model<EqtlColocDoc, EqtlColocModel>(
  'EqtlColoc',
  EqtlColocSchema,
  'eqtlcolocs',
);

export { EqtlColocModel };
