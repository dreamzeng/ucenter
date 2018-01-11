<template>
  <div class="row u-wsxz-detail-container">
    <div class="col-md-12">
        <div class="u-wsxz-detail-content">
            <iframe :src="documentObj.data.htmlUrl" frameborder="0"></iframe>
        </div>
        <div class="u-wsxz-detail-download">
            <Button type="primary" @click="download(documentObj.data.downUrl)" shape="circle">下载</Button>
        </div>
        
    </div>
  </div>
</template>

<script>
export default {
    mounted(){
        this.findDocumentContract()
    },
    data(){
        return {
            documentObj: {
                data:{}
            }
        }
    },
    methods: {
        findDocumentContract(){
            this.Api.workdesk.findDocumentContract({
                id: this.$route.params.id
            }).then(resp=>{
                this.documentObj = resp
            })
        },
        download(downloadUrl){
            location.href = downloadUrl
        }
    }
}
</script>

<style lang=less>
    .u-wsxz-detail-container{
        .u-wsxz-detail-content{
            background: #fff;
            padding: 20px 100px;
            height: 680px;
            overflow: auto;
            iframe{
                width: 100%;
                height: 90%;
            }
        }
        .u-wsxz-detail-download{
            text-align: center;
            margin-top: -80px;
        }
        
    }
</style>
