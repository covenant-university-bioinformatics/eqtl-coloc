#!/usr/bin/env bash
#sudo apt-get install -y r-cran-rmysql
# install.packages("devtools")
#devtools::install_github("boxiangliu/locuscomparer")
#if (!requireNamespace("BiocManager", quietly = TRUE)) install.packages("BiocManager")
#BiocManager::install("snpStats")
#BiocManager::install("coloc")
set -x;
bindir="/media/yagoubali/bioinfo2/pgwas/coloc"
dbdir="${bindir}/coloc_eqtl_files"
gwas_summary=$1
outdir=$2
GTEX8tissue=$3
p1=$4
p2=$5
p12=$6
type=$7 ##{"quant", "cc"}
s=$8

Rscript --vanilla ${bindir}/coloc.R ${gwas_summary}  ${outdir} ${dbdir}/${GTEX8tissue} \
   ${p1}   \
   ${p2}   \
   ${p12}  \
  ${type}  \
   ${s}

## Testing
#./coloc.sh CAD_GWAS.txt outdir Adipose_Subcutaneous.v8.signif_variant_gene_pairs.txt "1e-04" "1e-04" "1e-05" "cc" 0.33
#./coloc.sh UKB_bv_height_rsids_0.05.txt outdir2 Adipose_Subcutaneous.v8.signif_variant_gene_pairs.txt "1e-04" "1e-04" "1e-05" "cc" 0.33
