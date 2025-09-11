import { deprecate } from '../../util/console';
import { defineComponent } from 'vue';
/* @vue/component */
export default defineComponent({
    name: 'mobile',
    props: {
        mobileBreakpoint: {
            type: [Number, String],
            validator: v => (!isNaN(Number(v)) ||
                ['xs', 'sm', 'md', 'lg', 'xl'].includes(String(v))),
        },
    },
    computed: {
        $mobileBreakpoint() {
            return this.mobileBreakpoint || (this.$vuetify
                ? this.$vuetify.breakpoint.mobileBreakpoint
                : undefined);
        },
        isMobile() {
            const { mobile, width, name, mobileBreakpoint, } = this.$vuetify.breakpoint;
            // Check if local mobileBreakpoint matches
            // the application's mobileBreakpoint
            if (mobileBreakpoint === this.$mobileBreakpoint)
                return mobile;
            const mobileWidth = parseInt(this.$mobileBreakpoint, 10);
            const isNumber = !isNaN(mobileWidth);
            return isNumber
                ? width < mobileWidth
                : name === this.$mobileBreakpoint;
        },
    },
    created() {
        /* istanbul ignore next */
        if (this.$attrs.hasOwnProperty('mobile-break-point')) {
            deprecate('mobile-break-point', 'mobile-breakpoint', this);
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbWl4aW5zL21vYmlsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDOUMsT0FBTyxFQUFFLGVBQWUsRUFBWSxNQUFNLEtBQUssQ0FBQTtBQUUvQyxvQkFBb0I7QUFDcEIsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLFFBQVE7SUFFZCxLQUFLLEVBQUU7UUFDTCxnQkFBZ0IsRUFBRTtZQUNoQixJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFzQztZQUMzRCxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUNuRDtTQUNGO0tBQ0Y7SUFFRCxRQUFRLEVBQUU7UUFDUixpQkFBaUI7WUFDZixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2dCQUM5QyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCO2dCQUMzQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDZCxDQUFDO1FBQ0QsUUFBUTtZQUNOLE1BQU0sRUFDSixNQUFNLEVBQ04sS0FBSyxFQUNMLElBQUksRUFDSixnQkFBZ0IsR0FDakIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQTtZQUU1QiwwQ0FBMEM7WUFDMUMscUNBQXFDO1lBQ3JDLElBQUksZ0JBQWdCLEtBQUssSUFBSSxDQUFDLGlCQUFpQjtnQkFBRSxPQUFPLE1BQU0sQ0FBQTtZQUU5RCxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBQ3hELE1BQU0sUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBRXBDLE9BQU8sUUFBUTtnQkFDYixDQUFDLENBQUMsS0FBSyxHQUFHLFdBQVc7Z0JBQ3JCLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLGlCQUFpQixDQUFBO1FBQ3JDLENBQUM7S0FDRjtJQUVELE9BQU87UUFDTCwwQkFBMEI7UUFDMUIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO1lBQ3BELFNBQVMsQ0FBQyxvQkFBb0IsRUFBRSxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUMzRDtJQUNILENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUeXBlc1xuaW1wb3J0IHsgQnJlYWtwb2ludE5hbWUgfSBmcm9tICd2dWV0aWZ5L3R5cGVzL3NlcnZpY2VzL2JyZWFrcG9pbnQnXG5pbXBvcnQgeyBkZXByZWNhdGUgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQgeyBkZWZpbmVDb21wb25lbnQsIFByb3BUeXBlIH0gZnJvbSAndnVlJ1xuXG4vKiBAdnVlL2NvbXBvbmVudCAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29tcG9uZW50KHtcbiAgbmFtZTogJ21vYmlsZScsXG5cbiAgcHJvcHM6IHtcbiAgICBtb2JpbGVCcmVha3BvaW50OiB7XG4gICAgICB0eXBlOiBbTnVtYmVyLCBTdHJpbmddIGFzIFByb3BUeXBlPG51bWJlciB8IEJyZWFrcG9pbnROYW1lPixcbiAgICAgIHZhbGlkYXRvcjogdiA9PiAoXG4gICAgICAgICFpc05hTihOdW1iZXIodikpIHx8XG4gICAgICAgIFsneHMnLCAnc20nLCAnbWQnLCAnbGcnLCAneGwnXS5pbmNsdWRlcyhTdHJpbmcodikpXG4gICAgICApLFxuICAgIH0sXG4gIH0sXG5cbiAgY29tcHV0ZWQ6IHtcbiAgICAkbW9iaWxlQnJlYWtwb2ludCgpIHtcbiAgICAgIHJldHVybiB0aGlzLm1vYmlsZUJyZWFrcG9pbnQgfHwgKHRoaXMuJHZ1ZXRpZnlcbiAgICAgID8gdGhpcy4kdnVldGlmeS5icmVha3BvaW50Lm1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIDogdW5kZWZpbmVkKVxuICAgIH0sXG4gICAgaXNNb2JpbGUgKCk6IGJvb2xlYW4ge1xuICAgICAgY29uc3Qge1xuICAgICAgICBtb2JpbGUsXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBuYW1lLFxuICAgICAgICBtb2JpbGVCcmVha3BvaW50LFxuICAgICAgfSA9IHRoaXMuJHZ1ZXRpZnkuYnJlYWtwb2ludFxuXG4gICAgICAvLyBDaGVjayBpZiBsb2NhbCBtb2JpbGVCcmVha3BvaW50IG1hdGNoZXNcbiAgICAgIC8vIHRoZSBhcHBsaWNhdGlvbidzIG1vYmlsZUJyZWFrcG9pbnRcbiAgICAgIGlmIChtb2JpbGVCcmVha3BvaW50ID09PSB0aGlzLiRtb2JpbGVCcmVha3BvaW50KSByZXR1cm4gbW9iaWxlXG5cbiAgICAgIGNvbnN0IG1vYmlsZVdpZHRoID0gcGFyc2VJbnQodGhpcy4kbW9iaWxlQnJlYWtwb2ludCwgMTApXG4gICAgICBjb25zdCBpc051bWJlciA9ICFpc05hTihtb2JpbGVXaWR0aClcblxuICAgICAgcmV0dXJuIGlzTnVtYmVyXG4gICAgICAgID8gd2lkdGggPCBtb2JpbGVXaWR0aFxuICAgICAgICA6IG5hbWUgPT09IHRoaXMuJG1vYmlsZUJyZWFrcG9pbnRcbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZWQgKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHRoaXMuJGF0dHJzLmhhc093blByb3BlcnR5KCdtb2JpbGUtYnJlYWstcG9pbnQnKSkge1xuICAgICAgZGVwcmVjYXRlKCdtb2JpbGUtYnJlYWstcG9pbnQnLCAnbW9iaWxlLWJyZWFrcG9pbnQnLCB0aGlzKVxuICAgIH1cbiAgfSxcbn0pXG4iXX0=