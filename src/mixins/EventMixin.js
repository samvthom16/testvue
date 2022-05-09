export default {
    methods: {
        getLocation(post) {
            return this.getTermName('location', post.location);
        },
        getEventType(post) {
            return this.getTermName('event_type', post.event_type);
        },
        getTermName(field, term_id) {
            var settings = this.$store.state.account;

            //console.log( settings );
            //console.log( field );
            //console.log( settings[ field ][ term_id ] );

            if (settings != undefined && settings[field] && settings[field][term_id]) {
                return settings[field][term_id];
            }
            return '';
        },

        getDate(post) {
            var date = new Date(post.date);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var dt = date.getDate();

            if (dt < 10) {
                dt = '0' + dt;
            }
            if (month < 10) {
                month = '0' + month;
            }

            return year + '-' + month + '-' + dt;
        },
    }
};
