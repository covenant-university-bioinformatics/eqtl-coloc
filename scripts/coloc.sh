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
bindir="/mnt/d/eqtl-coloc"
dbdir="${bindir}/coloc_eqtl_files"
gwas_summary=$1
outdir=$2
GTEX8tissue=$3
p1=$4
p2=$5
p12=$6
type=$7 ##{"quant", "cc"} #quantification or case-control
s=$8 #proportion between case and control (between 0 and 1)

Rscript --vanilla ${bindir}/coloc.R ${gwas_summary}  ${outdir} ${dbdir}/${GTEX8tissue} \
   ${p1}   \
   ${p2}   \
   ${p12}  \
  ${type}  \
   ${s}

## Testing
#./coloc.sh CAD_GWAS.txt outdir Adipose_Subcutaneous.v8.signif_variant_gene_pairs.txt "1e-04" "1e-04" "1e-05" "cc" 0.33

#./coloc.sh CAD_GWAS.txt outdir Adipose_Subcutaneous.v8.signif_variant_gene_pairs.txt 1e-04 1e-04 1e-05 cc 0.33


#./coloc.sh UKB_bv_height_rsids_0.05.txt outdir2 Adipose_Subcutaneous.v8.signif_variant_gene_pairs.txt 1e-04 1e-04 1e-05 cc 0.33
