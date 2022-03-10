# /usr/bin/env Rscript
# To run it

# test if there is at least one argument: if not, return an error
args = commandArgs(trailingOnly=TRUE)

if (length(args)==0) {
  stop("Please check your input file", call.=FALSE)
}


gwas_summary=args[1]
outdir=args[2]
eqtl_file= args[3]
p1=args[4]
p2=args[5]
p12=args[6]
type=args[7]
s=args[8]
library('coloc')
#library("locuscomparer")

#eqtl <- read.table(gzfile(paste0(dbdir,"/",eqtl_file)),sep="\t", header=T, as.is=T);
eqtl_file=paste0(eqtl_file,".v8.signif_variant_gene_pairs.txt")
eqtl <- read.table(eqtl_file,sep="", header=T, as.is=T);

#hg19_lookup_table= paste0(dbdir,"/","GTEx_Analysis_2017-06-05_v8_WholeGenomeSeq_838Indiv_Analysis_Freeze.lookup_table.txt.gz")
#lookup_table= read.table(gzfile(hg19_lookup_table),sep="\t", header=T, as.is=T);
gwas <- read.table(file=gwas_summary, header=T, as.is=T);

### Remove duplicates rsids
unique_rsids= duplicated(trimws(as.character(gwas$rsid)))
index_rsids = which(unique_rsids == "FALSE")
gwas2=gwas[index_rsids,]

input <- merge(gwas2, eqtl, by="rsid", all=FALSE, suffixes=c("_eqtl","_gwas"))
unique_input= duplicated(trimws(as.character(input$rsid)))
index_input = which(unique_input == "FALSE")
input=input[index_input,]

dataset1 <- list(
  pvalues=input$pval_nominal_gwas,
  N=nrow(gwas2),
  #beta=input$slope_gwas,
  #varbeta=input$slope_se_gwas,
  snp=unique(input$rsid)
)

### gwas: check is beta (slope) does not havwe missings values
### gwas: check is se (slope_se) does not havwe missings values
slope_gwas_check= is.na(input$slope_gwas)
slope_gwas= length(which(slope_gwas_check=="FALSE"))
se_gwas_check= is.na(input$slope_se_gwas)
se_gwas= length(which(se_gwas_check=="FALSE"))
if(length(slope_gwas)==dim(input)[1] &&	(length(slope_gwas)==length(se_gwas))){
  dataset1=append(
           dataset1,
           list(beta=input$slope_gwas)
         )
dataset1=append(
          dataset1,
          list(varbeta=input$slope_se_gwas)
                )
}

#### add type
dataset1=append(
         dataset1,
         list(type=type))

if (type == "cc"){
  dataset1=append(
           dataset1,
           list(s=as.numeric(s)))
  }



dataset2 <- list(
  pvalues=input$pval_nominal_eqtl,
  N=nrow(eqtl),
  #beta=input$slope_eqtl,
  #varbeta=input$slope_se_eqtl,
  type="quant",
  snp=unique(input$rsid)
)

### eqtl: check is beta (slope) does not havwe missings values
### eaql: check is se (slope_se) does not havwe missings values

slope_eqtl_check= is.na(input$slope_eqtl)
slope_eqtl= length(which(slope_eqtl_check=="FALSE"))
se_eqtl_check= is.na(input$slope_se_eqtl)
se_eqtl= length(which(se_eqtl_check=="FALSE"))
if(length(slope_eqtl)==dim(input)[1] &&	(length(slope_eqtl)==length(se_eqtl))){
  dataset2=append(
           dataset2,
           list(beta=input$slope_eqtl)
         )
dataset2=append(
          dataset2,
          list(varbeta=input$slope_se_eqtl)
                )
}

  result=coloc.abf(dataset1, dataset2, MAF = input$maf, p1 = as.numeric(p1),
  p2 = as.numeric(p2), p12 = as.numeric(p12))



output_summary=paste0(outdir,"/coloc_summary.txt")
output_results=paste0(outdir,"/coloc_results.txt")
write.table(t(as.data.frame(result$summary)),file=output_summary,row.names=FALSE,col.names=TRUE, sep="\t")
write.table(result$results,file=output_results,row.names=FALSE,col.names=TRUE, sep="\t")

#Arguments:
#dataset1: a list with specifically named elements defining the dataset to be analysed. See ‘check_dataset’ for details.
#dataset2: as above, for dataset 2
#MAF: Common minor allele frequency vector to be used for both dataset1 and dataset2, a shorthand for supplying the same
     #vector as parts of both datasets
#p1: prior probability a SNP is associated with trait 1, default 1e-4
#p2: prior probability a SNP is associated with trait 2, default 1e-4
# p12: prior probability a SNP is associated with both traits, default 1e-5


# ## tseying in R
# setwd("/media/yagoubali/bioinfo2/pgwas/coloc")
# gwas_summary="CAD_GWAS.txt"
# outdir="./outdir"
# eqtl_file= "/media/yagoubali/bioinfo2/pgwas/coloc/coloc_eqtl_files/Adipose_Subcutaneous.v8.signif_variant_gene_pairs.txt"
# p1=1e-04
# p2=1e-04
# p2=1e-05
