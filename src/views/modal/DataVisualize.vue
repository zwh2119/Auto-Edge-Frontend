<template>
    <div>
        <h3>数据流可视化</h3>
    </div>
    <br>
    <div class="image-container">
        <img :src="imgSrc" />
        <!-- <p>{{ data }}</p> -->
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
        }
    },
    computed: {
        imgSrc() {
            // console.log(this.data)
            if (!this.data) {
                return null
            }
            // 
            else if (!this.data[this.data.length - 1]) {

                return null
            }
            else {
                console.log(this.data[this.data.length - 1])
                return this.data[this.data.length - 1]['visualize']
            }
        }
    }

};
</script>

<style scoped>
.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>