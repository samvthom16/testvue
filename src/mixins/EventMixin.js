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
    }
};
