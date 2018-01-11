export default {
    methods:{
        dateDiff(startTime, endTime){
            var st = new Date(startTime);
            var et = new Date(endTime);
            return (et.getTime() - st.getTime()) / 86400000;
        }
    }
}