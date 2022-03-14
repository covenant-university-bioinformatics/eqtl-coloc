#!/usr/bin/env bash
#sudo apt-get install -y r-cran-rmysql
# install.packages("devtools")
#devtools::install_github("boxiangliu/locuscomparer")
#if (!requireNamespace("BiocManager", quietly = TRUE)) install.packages("BiocManager")
#BiocManager::install("snpStats")
#BiocManager::install("coloc")
######
#RUN apt-get install -y -qq r-cran-devtools
#RUN R -e "devtools::install_github('boxiangliu/locuscomparer')"
#RUN R -e "install.packages(c('coloc'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
set -x;
#development
#bindir="/local/datasets/eqtlcoloc"

#production
bindir="/local/datasets/eqtlcoloc"

dbdir="${bindir}/coloc_eqtl_files"
gwas_summary=$1
outdir=$2
GTEX8tissue=$3
p1=$4
p2=$5
p12=$6
type=$7 ##{"quant", "cc"} #quantification or case-control
s=$8 #proportion between case and control (between 0 and 1)

Rscript --vanilla ${bindir}/coloc.R ${gwas_summary}  ${outdir} "${dbdir}/${GTEX8tissue}.v8.signif_variant_gene_pairs.txt" \
   ${p1}   \
   ${p2}   \
   ${p12}  \
  ${type}  \
   ${s}

## Testing
#./coloc.sh CAD_GWAS.txt outdir Adipose_Subcutaneous.v8.signif_variant_gene_pairs.txt "1e-04" "1e-04" "1e-05" "cc" 0.33

#./coloc.sh CAD_GWAS.txt outdir Adipose_Subcutaneous.v8.signif_variant_gene_pairs.txt 1e-04 1e-04 1e-05 cc 0.33


#./coloc.sh UKB_bv_height_rsids_0.05.txt outdir2 Adipose_Subcutaneous.v8.signif_variant_gene_pairs.txt 1e-04 1e-04 1e-05 cc 0.33


######Tissues
# Adipose_Subcutaneous
# Adipose_Visceral_Omentum
# Adrenal_Gland
# Artery_Aorta
# Artery_Coronary
# Artery_Tibial
# Brain_Amygdala
# Brain_Anterior_cingulate_cortex_BA24
# Brain_Caudate_basal_ganglia
# Brain_Cerebellar_Hemisphere
# Brain_Cerebellum
# Brain_Cortex
# Brain_Frontal_Cortex_BA9
# Brain_Hippocampus
# Brain_Hypothalamus
# Brain_Nucleus_accumbens_basal_ganglia
# Brain_Putamen_basal_ganglia
# Brain_Spinal_cord_cervical_c-1
# Brain_Substantia_nigra
# Breast_Mammary_Tissue
# Cells_Cultured_fibroblasts
# Cells_EBV-transformed_lymphocytes
# Colon_Sigmoid
# Colon_Transverse
# Esophagus_Gastroesophageal_Junction
# Esophagus_Mucosa
# Esophagus_Muscularis
# Heart_Atrial_Appendage
# Heart_Left_Ventricle
# Kidney_Cortex
# Liver
# Lung
# Minor_Salivary_Gland
# Muscle_Skeletal
# Nerve_Tibial
# Ovary
# Pancreas
# Pituitary
# Prostate
# Skin_Not_Sun_Exposed_Suprapubic
# Skin_Sun_Exposed_Lower_leg
# Small_Intestine_Terminal_Ileum
# Spleen
# Stomach
# Testis
# Thyroid
# Uterus
# Vagina
# Whole_Blood
