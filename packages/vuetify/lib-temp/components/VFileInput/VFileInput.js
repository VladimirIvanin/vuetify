// Styles
import './VFileInput.sass';
// Extensions
import VTextField from '../VTextField';
// Components
import { VChip } from '../VChip';
// Utilities
import { deepEqual, humanReadableFileSize, wrapInArray } from '../../util/helpers';
import { consoleError } from '../../util/console';
import { mergeStyles } from '../../util/mergeData';
import { defineComponent, h } from 'vue';
export default defineComponent({
    name: 'v-file-input',
    extends: VTextField,
    model: {
        prop: 'value',
        event: 'change',
    },
    props: {
        chips: Boolean,
        clearable: {
            type: Boolean,
            default: true,
        },
        counterSizeString: {
            type: String,
            default: '$vuetify.fileInput.counterSize',
        },
        counterString: {
            type: String,
            default: '$vuetify.fileInput.counter',
        },
        hideInput: Boolean,
        multiple: Boolean,
        placeholder: String,
        prependIcon: {
            type: String,
            default: '$file',
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        showSize: {
            type: [Boolean, Number],
            default: false,
            validator: (v) => {
                return (typeof v === 'boolean' ||
                    [1000, 1024].includes(v));
            },
        },
        smallChips: Boolean,
        truncateLength: {
            type: [Number, String],
            default: 22,
        },
        type: {
            type: String,
            default: 'file',
        },
        value: {
            default: undefined,
            validator: val => {
                return wrapInArray(val).every(v => v != null && typeof v === 'object');
            },
        },
    },
    emits: ['change', 'keydown'],
    computed: {
        classes() {
            return {
                ...VTextField.computed.classes.call(this),
                'v-file-input': true,
            };
        },
        computedCounterValue() {
            const fileCount = (this.multiple && this.lazyValue)
                ? this.lazyValue.length
                : (this.lazyValue instanceof File) ? 1 : 0;
            if (!this.showSize)
                return this.$vuetify.lang.t(this.counterString, fileCount);
            const bytes = this.internalArrayValue.reduce((bytes, { size = 0 }) => {
                return bytes + size;
            }, 0);
            return this.$vuetify.lang.t(this.counterSizeString, fileCount, humanReadableFileSize(bytes, this.base === 1024));
        },
        internalArrayValue() {
            return wrapInArray(this.internalValue);
        },
        internalValue: {
            get() {
                return this.lazyValue;
            },
            set(val) {
                this.lazyValue = val;
                this.$emit('change', this.lazyValue);
            },
        },
        isDirty() {
            return this.internalArrayValue.length > 0;
        },
        isLabelActive() {
            return this.isDirty;
        },
        text() {
            if (!this.isDirty && (this.persistentPlaceholder || this.isFocused || !this.hasLabel))
                return [this.placeholder];
            return this.internalArrayValue.map((file) => {
                const { name = '', size = 0, } = file;
                const truncatedText = this.truncateText(name);
                return !this.showSize
                    ? truncatedText
                    : `${truncatedText} (${humanReadableFileSize(size, this.base === 1024)})`;
            });
        },
        base() {
            return typeof this.showSize !== 'boolean' ? this.showSize : undefined;
        },
        hasChips() {
            return this.chips || this.smallChips;
        },
    },
    watch: {
        readonly: {
            handler(v) {
                if (v === true)
                    consoleError('readonly is not supported on <v-file-input>', this);
            },
            immediate: true,
        },
        value(v) {
            const value = this.multiple ? v : v ? [v] : [];
            if (!deepEqual(value, this.$refs.input.files)) {
                // When the input value is changed programatically, clear the
                // internal input's value so that the `onInput` handler
                // can be triggered again if the user re-selects the exact
                // same file(s). Ideally, `input.files` should be
                // manipulated directly but that property is readonly.
                this.$refs.input.value = '';
            }
        },
    },
    methods: {
        clearableCallback() {
            this.internalValue = this.multiple ? [] : null;
            this.$refs.input.value = '';
        },
        genChips() {
            if (!this.isDirty)
                return [];
            return this.text.map((text, index) => h(VChip, {
                small: this.smallChips,
                'onClick:close': () => {
                    const internalValue = this.internalValue;
                    internalValue.splice(index, 1);
                    this.internalValue = internalValue; // Trigger the watcher
                }
            }, [text]));
        },
        genControl() {
            const render = VTextField.methods.genControl.call(this);
            if (this.hideInput) {
                render.style = mergeStyles(render.style, { display: 'none' });
            }
            return render;
        },
        genInput() {
            const input = VTextField.methods.genInput.call(this);
            input.multiple = this.multiple;
            // We should not be setting value
            // programmatically on the input
            // when it is using type="file"
            delete input.value;
            // This solves an issue in Safari where
            // nothing happens when adding a file
            // due to the input event not firing
            // https://github.com/vuetifyjs/vuetify/issues/7941
            delete input.onInput;
            input.onChange = this.onInput;
            return [this.genSelections(), input];
        },
        genPrependSlot() {
            if (!this.prependIcon)
                return null;
            const icon = this.genIcon('prepend', () => {
                this.$refs.input.click();
            });
            return this.genSlot('prepend', 'outer', [icon]);
        },
        genSelectionText() {
            const length = this.text.length;
            if (length < 2)
                return this.text;
            if (this.showSize && !this.counter)
                return [this.computedCounterValue];
            return [this.$vuetify.lang.t(this.counterString, length)];
        },
        genSelections() {
            const children = [];
            if (this.isDirty && this.$slots.selection) {
                this.internalArrayValue.forEach((file, index) => {
                    if (!this.$slots.selection)
                        return;
                    children.push(this.$slots.selection({
                        text: this.text[index],
                        file,
                        index,
                    }));
                });
            }
            else {
                children.push(this.hasChips && this.isDirty ? this.genChips() : this.genSelectionText());
            }
            return h('div', {
                class: ['v-file-input__text', {
                        'v-file-input__text--placeholder': this.placeholder && !this.isDirty,
                        'v-file-input__text--chips': this.hasChips && !this.$slots.selection,
                    }]
            }, children);
        },
        genTextFieldSlot() {
            const node = VTextField.methods.genTextFieldSlot.call(this);
            node.onClick = (e) => {
                // Clicking the label already delegates to input element, so we shouldn't click it twice
                if (e.target && e.target.nodeName === 'LABEL')
                    return;
                this.$refs.input.click();
            };
            return node;
        },
        onInput(e) {
            const files = [...e.target.files || []];
            this.internalValue = this.multiple ? files : files[0];
            // Set initialValue here otherwise isFocused
            // watcher in VTextField will emit a change
            // event whenever the component is blurred
            this.initialValue = this.internalValue;
        },
        onKeyDown(e) {
            this.$emit('keydown', e);
        },
        truncateText(str) {
            if (str.length < Number(this.truncateLength))
                return str;
            const charsKeepOneSide = Math.floor((Number(this.truncateLength) - 1) / 2);
            return `${str.slice(0, charsKeepOneSide)}…${str.slice(str.length - charsKeepOneSide)}`;
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVkZpbGVJbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1ZGaWxlSW5wdXQvVkZpbGVJbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFTO0FBQ1QsT0FBTyxtQkFBbUIsQ0FBQTtBQUUxQixhQUFhO0FBQ2IsT0FBTyxVQUFVLE1BQU0sZUFBZSxDQUFBO0FBRXRDLGFBQWE7QUFDYixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBS2hDLFlBQVk7QUFDWixPQUFPLEVBQUUsU0FBUyxFQUFFLHFCQUFxQixFQUFFLFdBQVcsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ2xGLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNqRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUE7QUFDbEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDLEVBQUUsTUFBTSxLQUFLLENBQUE7QUFFeEMsZUFBZSxlQUFlLENBQUM7SUFDN0IsSUFBSSxFQUFFLGNBQWM7SUFDcEIsT0FBTyxFQUFFLFVBQVU7SUFFbkIsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE9BQU87UUFDYixLQUFLLEVBQUUsUUFBUTtLQUNoQjtJQUVELEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxPQUFPO1FBQ2QsU0FBUyxFQUFFO1lBQ1QsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkO1FBQ0QsaUJBQWlCLEVBQUU7WUFDakIsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsZ0NBQWdDO1NBQzFDO1FBQ0QsYUFBYSxFQUFFO1lBQ2IsSUFBSSxFQUFFLE1BQU07WUFDWixPQUFPLEVBQUUsNEJBQTRCO1NBQ3RDO1FBQ0QsU0FBUyxFQUFFLE9BQU87UUFDbEIsUUFBUSxFQUFFLE9BQU87UUFDakIsV0FBVyxFQUFFLE1BQU07UUFDbkIsV0FBVyxFQUFF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QyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRXJELDRDQUE0QztZQUM1QywyQ0FBMkM7WUFDM0MsMENBQTBDO1lBQzFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQTtRQUN4QyxDQUFDO1FBQ0QsU0FBUyxDQUFFLENBQWdCO1lBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzFCLENBQUM7UUFDRCxZQUFZLENBQUUsR0FBVztZQUN2QixJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7Z0JBQUUsT0FBTyxHQUFHLENBQUE7WUFDeEQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUMxRSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsRUFBRSxDQUFBO1FBQ3hGLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIFN0eWxlc1xuaW1wb3J0ICcuL1ZGaWxlSW5wdXQuc2FzcydcblxuLy8gRXh0ZW5zaW9uc1xuaW1wb3J0IFZUZXh0RmllbGQgZnJvbSAnLi4vVlRleHRGaWVsZCdcblxuLy8gQ29tcG9uZW50c1xuaW1wb3J0IHsgVkNoaXAgfSBmcm9tICcuLi9WQ2hpcCdcblxuLy8gVHlwZXNcbmltcG9ydCB7IFByb3BWYWxpZGF0b3IgfSBmcm9tICd2dWUvdHlwZXMvb3B0aW9ucydcblxuLy8gVXRpbGl0aWVzXG5pbXBvcnQgeyBkZWVwRXF1YWwsIGh1bWFuUmVhZGFibGVGaWxlU2l6ZSwgd3JhcEluQXJyYXkgfSBmcm9tICcuLi8uLi91dGlsL2hlbHBlcnMnXG5pbXBvcnQgeyBjb25zb2xlRXJyb3IgfSBmcm9tICcuLi8uLi91dGlsL2NvbnNvbGUnXG5pbXBvcnQgeyBtZXJnZVN0eWxlcyB9IGZyb20gJy4uLy4uL3V0aWwvbWVyZ2VEYXRhJ1xuaW1wb3J0IHsgZGVmaW5lQ29tcG9uZW50LCBoIH0gZnJvbSAndnVlJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb21wb25lbnQoe1xuICBuYW1lOiAndi1maWxlLWlucHV0JyxcbiAgZXh0ZW5kczogVlRleHRGaWVsZCxcblxuICBtb2RlbDoge1xuICAgIHByb3A6ICd2YWx1ZScsXG4gICAgZXZlbnQ6ICdjaGFuZ2UnLFxuICB9LFxuXG4gIHByb3BzOiB7XG4gICAgY2hpcHM6IEJvb2xlYW4sXG4gICAgY2xlYXJhYmxlOiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB9LFxuICAgIGNvdW50ZXJTaXplU3RyaW5nOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnJHZ1ZXRpZnkuZmlsZUlucHV0LmNvdW50ZXJTaXplJyxcbiAgICB9LFxuICAgIGNvdW50ZXJTdHJpbmc6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICckdnVldGlmeS5maWxlSW5wdXQuY291bnRlcicsXG4gICAgfSxcbiAgICBoaWRlSW5wdXQ6IEJvb2xlYW4sXG4gICAgbXVsdGlwbGU6IEJvb2xlYW4sXG4gICAgcGxhY2Vob2xkZXI6IFN0cmluZyxcbiAgICBwcmVwZW5kSWNvbjoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJyRmaWxlJyxcbiAgICB9LFxuICAgIHJlYWRvbmx5OiB7XG4gICAgICB0eXBlOiBCb29sZWFuLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBzaG93U2l6ZToge1xuICAgICAgdHlwZTogW0Jvb2xlYW4sIE51bWJlcl0sXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIHZhbGlkYXRvcjogKHY6IGJvb2xlYW4gfCBudW1iZXIpID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICB0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICAgWzEwMDAsIDEwMjRdLmluY2x1ZGVzKHYpXG4gICAgICAgIClcbiAgICAgIH0sXG4gICAgfSBhcyBQcm9wVmFsaWRhdG9yPGJvb2xlYW4gfCAxMDAwIHwgMTAyND4sXG4gICAgc21hbGxDaGlwczogQm9vbGVhbixcbiAgICB0cnVuY2F0ZUxlbmd0aDoge1xuICAgICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcbiAgICAgIGRlZmF1bHQ6IDIyLFxuICAgIH0sXG4gICAgdHlwZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2ZpbGUnLFxuICAgIH0sXG4gICAgdmFsdWU6IHtcbiAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgIHZhbGlkYXRvcjogdmFsID0+IHtcbiAgICAgICAgcmV0dXJuIHdyYXBJbkFycmF5KHZhbCkuZXZlcnkodiA9PiB2ICE9IG51bGwgJiYgdHlwZW9mIHYgPT09ICdvYmplY3QnKVxuICAgICAgfSxcbiAgICB9IGFzIFByb3BWYWxpZGF0b3I8RmlsZSB8IEZpbGVbXT4sXG4gIH0sXG5cbiAgZW1pdHM6IFsnY2hhbmdlJywgJ2tleWRvd24nXSxcblxuICBjb21wdXRlZDoge1xuICAgIGNsYXNzZXMgKCk6IG9iamVjdCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5WVGV4dEZpZWxkLmNvbXB1dGVkLmNsYXNzZXMuY2FsbCh0aGlzKSxcbiAgICAgICAgJ3YtZmlsZS1pbnB1dCc6IHRydWUsXG4gICAgICB9XG4gICAgfSxcbiAgICBjb21wdXRlZENvdW50ZXJWYWx1ZSAoKTogc3RyaW5nIHtcbiAgICAgIGNvbnN0IGZpbGVDb3VudCA9ICh0aGlzLm11bHRpcGxlICYmIHRoaXMubGF6eVZhbHVlKVxuICAgICAgICA/IHRoaXMubGF6eVZhbHVlLmxlbmd0aFxuICAgICAgICA6ICh0aGlzLmxhenlWYWx1ZSBpbnN0YW5jZW9mIEZpbGUpID8gMSA6IDBcblxuICAgICAgaWYgKCF0aGlzLnNob3dTaXplKSByZXR1cm4gdGhpcy4kdnVldGlmeS5sYW5nLnQodGhpcy5jb3VudGVyU3RyaW5nLCBmaWxlQ291bnQpXG5cbiAgICAgIGNvbnN0IGJ5dGVzID0gdGhpcy5pbnRlcm5hbEFycmF5VmFsdWUucmVkdWNlKChieXRlczogbnVtYmVyLCB7IHNpemUgPSAwIH06IEZpbGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGJ5dGVzICsgc2l6ZVxuICAgICAgfSwgMClcblxuICAgICAgcmV0dXJuIHRoaXMuJHZ1ZXRpZnkubGFuZy50KFxuICAgICAgICB0aGlzLmNvdW50ZXJTaXplU3RyaW5nLFxuICAgICAgICBmaWxlQ291bnQsXG4gICAgICAgIGh1bWFuUmVhZGFibGVGaWxlU2l6ZShieXRlcywgdGhpcy5iYXNlID09PSAxMDI0KVxuICAgICAgKVxuICAgIH0sXG4gICAgaW50ZXJuYWxBcnJheVZhbHVlICgpOiBGaWxlW10ge1xuICAgICAgcmV0dXJuIHdyYXBJbkFycmF5KHRoaXMuaW50ZXJuYWxWYWx1ZSlcbiAgICB9LFxuICAgIGludGVybmFsVmFsdWU6IHtcbiAgICAgIGdldCAoKTogRmlsZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGF6eVZhbHVlXG4gICAgICB9LFxuICAgICAgc2V0ICh2YWw6IEZpbGUgfCBGaWxlW10pIHtcbiAgICAgICAgdGhpcy5sYXp5VmFsdWUgPSB2YWxcbiAgICAgICAgdGhpcy4kZW1pdCgnY2hhbmdlJywgdGhpcy5sYXp5VmFsdWUpXG4gICAgICB9LFxuICAgIH0sXG4gICAgaXNEaXJ0eSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbEFycmF5VmFsdWUubGVuZ3RoID4gMFxuICAgIH0sXG4gICAgaXNMYWJlbEFjdGl2ZSAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5pc0RpcnR5XG4gICAgfSxcbiAgICB0ZXh0ICgpOiBzdHJpbmdbXSB7XG4gICAgICBpZiAoIXRoaXMuaXNEaXJ0eSAmJiAodGhpcy5wZXJzaXN0ZW50UGxhY2Vob2xkZXIgfHwgdGhpcy5pc0ZvY3VzZWQgfHwgIXRoaXMuaGFzTGFiZWwpKSByZXR1cm4gW3RoaXMucGxhY2Vob2xkZXJdXG5cbiAgICAgIHJldHVybiB0aGlzLmludGVybmFsQXJyYXlWYWx1ZS5tYXAoKGZpbGU6IEZpbGUpID0+IHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIG5hbWUgPSAnJyxcbiAgICAgICAgICBzaXplID0gMCxcbiAgICAgICAgfSA9IGZpbGVcblxuICAgICAgICBjb25zdCB0cnVuY2F0ZWRUZXh0ID0gdGhpcy50cnVuY2F0ZVRleHQobmFtZSlcblxuICAgICAgICByZXR1cm4gIXRoaXMuc2hvd1NpemVcbiAgICAgICAgICA/IHRydW5jYXRlZFRleHRcbiAgICAgICAgICA6IGAke3RydW5jYXRlZFRleHR9ICgke2h1bWFuUmVhZGFibGVGaWxlU2l6ZShzaXplLCB0aGlzLmJhc2UgPT09IDEwMjQpfSlgXG4gICAgICB9KVxuICAgIH0sXG4gICAgYmFzZSAoKTogMTAwMCB8IDEwMjQgfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLnNob3dTaXplICE9PSAnYm9vbGVhbicgPyB0aGlzLnNob3dTaXplIDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICBoYXNDaGlwcyAoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5jaGlwcyB8fCB0aGlzLnNtYWxsQ2hpcHNcbiAgICB9LFxuICB9LFxuXG4gIHdhdGNoOiB7XG4gICAgcmVhZG9ubHk6IHtcbiAgICAgIGhhbmRsZXIgKHYpIHtcbiAgICAgICAgaWYgKHYgPT09IHRydWUpIGNvbnNvbGVFcnJvcigncmVhZG9ubHkgaXMgbm90IHN1cHBvcnRlZCBvbiA8di1maWxlLWlucHV0PicsIHRoaXMpXG4gICAgICB9LFxuICAgICAgaW1tZWRpYXRlOiB0cnVlLFxuICAgIH0sXG4gICAgdmFsdWUgKHYpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5tdWx0aXBsZSA/IHYgOiB2ID8gW3ZdIDogW11cbiAgICAgIGlmICghZGVlcEVxdWFsKHZhbHVlLCB0aGlzLiRyZWZzLmlucHV0LmZpbGVzKSkge1xuICAgICAgICAvLyBXaGVuIHRoZSBpbnB1dCB2YWx1ZSBpcyBjaGFuZ2VkIHByb2dyYW1hdGljYWxseSwgY2xlYXIgdGhlXG4gICAgICAgIC8vIGludGVybmFsIGlucHV0J3MgdmFsdWUgc28gdGhhdCB0aGUgYG9uSW5wdXRgIGhhbmRsZXJcbiAgICAgICAgLy8gY2FuIGJlIHRyaWdnZXJlZCBhZ2FpbiBpZiB0aGUgdXNlciByZS1zZWxlY3RzIHRoZSBleGFjdFxuICAgICAgICAvLyBzYW1lIGZpbGUocykuIElkZWFsbHksIGBpbnB1dC5maWxlc2Agc2hvdWxkIGJlXG4gICAgICAgIC8vIG1hbmlwdWxhdGVkIGRpcmVjdGx5IGJ1dCB0aGF0IHByb3BlcnR5IGlzIHJlYWRvbmx5LlxuICAgICAgICB0aGlzLiRyZWZzLmlucHV0LnZhbHVlID0gJydcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuXG4gIG1ldGhvZHM6IHtcbiAgICBjbGVhcmFibGVDYWxsYmFjayAoKSB7XG4gICAgICB0aGlzLmludGVybmFsVmFsdWUgPSB0aGlzLm11bHRpcGxlID8gW10gOiBudWxsXG4gICAgICB0aGlzLiRyZWZzLmlucHV0LnZhbHVlID0gJydcbiAgICB9LFxuICAgIGdlbkNoaXBzICgpIHtcbiAgICAgIGlmICghdGhpcy5pc0RpcnR5KSByZXR1cm4gW11cblxuICAgICAgcmV0dXJuIHRoaXMudGV4dC5tYXAoKHRleHQsIGluZGV4KSA9PiBoKFZDaGlwLCB7XG4gICAgICAgIHNtYWxsOiB0aGlzLnNtYWxsQ2hpcHMsXG4gICAgICAgICdvbkNsaWNrOmNsb3NlJzogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGludGVybmFsVmFsdWUgPSB0aGlzLmludGVybmFsVmFsdWVcbiAgICAgICAgICBpbnRlcm5hbFZhbHVlLnNwbGljZShpbmRleCwgMSlcbiAgICAgICAgICB0aGlzLmludGVybmFsVmFsdWUgPSBpbnRlcm5hbFZhbHVlIC8vIFRyaWdnZXIgdGhlIHdhdGNoZXJcbiAgICAgICAgfVxuICAgICAgfSwgW3RleHRdKSlcbiAgICB9LFxuICAgIGdlbkNvbnRyb2wgKCkge1xuICAgICAgY29uc3QgcmVuZGVyID0gVlRleHRGaWVsZC5tZXRob2RzLmdlbkNvbnRyb2wuY2FsbCh0aGlzKVxuXG4gICAgICBpZiAodGhpcy5oaWRlSW5wdXQpIHtcbiAgICAgICAgcmVuZGVyLnN0eWxlID0gbWVyZ2VTdHlsZXMoXG4gICAgICAgICAgcmVuZGVyLnN0eWxlLFxuICAgICAgICAgIHsgZGlzcGxheTogJ25vbmUnIH1cbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVuZGVyXG4gICAgfSxcbiAgICBnZW5JbnB1dCAoKSB7XG4gICAgICBjb25zdCBpbnB1dCA9IFZUZXh0RmllbGQubWV0aG9kcy5nZW5JbnB1dC5jYWxsKHRoaXMpXG5cbiAgICAgIGlucHV0Lm11bHRpcGxlID0gdGhpcy5tdWx0aXBsZVxuXG4gICAgICAvLyBXZSBzaG91bGQgbm90IGJlIHNldHRpbmcgdmFsdWVcbiAgICAgIC8vIHByb2dyYW1tYXRpY2FsbHkgb24gdGhlIGlucHV0XG4gICAgICAvLyB3aGVuIGl0IGlzIHVzaW5nIHR5cGU9XCJmaWxlXCJcbiAgICAgIGRlbGV0ZSBpbnB1dC52YWx1ZVxuXG4gICAgICAvLyBUaGlzIHNvbHZlcyBhbiBpc3N1ZSBpbiBTYWZhcmkgd2hlcmVcbiAgICAgIC8vIG5vdGhpbmcgaGFwcGVucyB3aGVuIGFkZGluZyBhIGZpbGVcbiAgICAgIC8vIGR1ZSB0byB0aGUgaW5wdXQgZXZlbnQgbm90IGZpcmluZ1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3Z1ZXRpZnlqcy92dWV0aWZ5L2lzc3Vlcy83OTQxXG4gICAgICBkZWxldGUgaW5wdXQub25JbnB1dFxuICAgICAgaW5wdXQub25DaGFuZ2UgPSB0aGlzLm9uSW5wdXRcblxuICAgICAgcmV0dXJuIFt0aGlzLmdlblNlbGVjdGlvbnMoKSwgaW5wdXRdXG4gICAgfSxcbiAgICBnZW5QcmVwZW5kU2xvdCAoKSB7XG4gICAgICBpZiAoIXRoaXMucHJlcGVuZEljb24pIHJldHVybiBudWxsXG5cbiAgICAgIGNvbnN0IGljb24gPSB0aGlzLmdlbkljb24oJ3ByZXBlbmQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuJHJlZnMuaW5wdXQuY2xpY2soKVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHRoaXMuZ2VuU2xvdCgncHJlcGVuZCcsICdvdXRlcicsIFtpY29uXSlcbiAgICB9LFxuICAgIGdlblNlbGVjdGlvblRleHQgKCk6IHN0cmluZ1tdIHtcbiAgICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMudGV4dC5sZW5ndGhcblxuICAgICAgaWYgKGxlbmd0aCA8IDIpIHJldHVybiB0aGlzLnRleHRcbiAgICAgIGlmICh0aGlzLnNob3dTaXplICYmICF0aGlzLmNvdW50ZXIpIHJldHVybiBbdGhpcy5jb21wdXRlZENvdW50ZXJWYWx1ZV1cbiAgICAgIHJldHVybiBbdGhpcy4kdnVldGlmeS5sYW5nLnQodGhpcy5jb3VudGVyU3RyaW5nLCBsZW5ndGgpXVxuICAgIH0sXG4gICAgZ2VuU2VsZWN0aW9ucyAoKSB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IFtdXG5cbiAgICAgIGlmICh0aGlzLmlzRGlydHkgJiYgdGhpcy4kc2xvdHMuc2VsZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuaW50ZXJuYWxBcnJheVZhbHVlLmZvckVhY2goKGZpbGU6IEZpbGUsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuJHNsb3RzLnNlbGVjdGlvbikgcmV0dXJuXG5cbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKFxuICAgICAgICAgICAgdGhpcy4kc2xvdHMuc2VsZWN0aW9uKHtcbiAgICAgICAgICAgICAgdGV4dDogdGhpcy50ZXh0W2luZGV4XSxcbiAgICAgICAgICAgICAgZmlsZSxcbiAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy5oYXNDaGlwcyAmJiB0aGlzLmlzRGlydHkgPyB0aGlzLmdlbkNoaXBzKCkgOiB0aGlzLmdlblNlbGVjdGlvblRleHQoKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFsndi1maWxlLWlucHV0X190ZXh0Jywge1xuICAgICAgICAgICd2LWZpbGUtaW5wdXRfX3RleHQtLXBsYWNlaG9sZGVyJzogdGhpcy5wbGFjZWhvbGRlciAmJiAhdGhpcy5pc0RpcnR5LFxuICAgICAgICAgICd2LWZpbGUtaW5wdXRfX3RleHQtLWNoaXBzJzogdGhpcy5oYXNDaGlwcyAmJiAhdGhpcy4kc2xvdHMuc2VsZWN0aW9uLFxuICAgICAgICB9XVxuICAgICAgfSwgY2hpbGRyZW4pXG4gICAgfSxcbiAgICBnZW5UZXh0RmllbGRTbG90ICgpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBWVGV4dEZpZWxkLm1ldGhvZHMuZ2VuVGV4dEZpZWxkU2xvdC5jYWxsKHRoaXMpXG5cbiAgICAgIG5vZGUub25DbGljayA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgIC8vIENsaWNraW5nIHRoZSBsYWJlbCBhbHJlYWR5IGRlbGVnYXRlcyB0byBpbnB1dCBlbGVtZW50LCBzbyB3ZSBzaG91bGRuJ3QgY2xpY2sgaXQgdHdpY2VcbiAgICAgICAgaWYgKGUudGFyZ2V0ICYmIChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkubm9kZU5hbWUgPT09ICdMQUJFTCcpIHJldHVyblxuXG4gICAgICAgIHRoaXMuJHJlZnMuaW5wdXQuY2xpY2soKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbm9kZVxuICAgIH0sXG4gICAgb25JbnB1dCAoZTogRXZlbnQpIHtcbiAgICAgIGNvbnN0IGZpbGVzID0gWy4uLihlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5maWxlcyB8fCBbXV1cblxuICAgICAgdGhpcy5pbnRlcm5hbFZhbHVlID0gdGhpcy5tdWx0aXBsZSA/IGZpbGVzIDogZmlsZXNbMF1cblxuICAgICAgLy8gU2V0IGluaXRpYWxWYWx1ZSBoZXJlIG90aGVyd2lzZSBpc0ZvY3VzZWRcbiAgICAgIC8vIHdhdGNoZXIgaW4gVlRleHRGaWVsZCB3aWxsIGVtaXQgYSBjaGFuZ2VcbiAgICAgIC8vIGV2ZW50IHdoZW5ldmVyIHRoZSBjb21wb25lbnQgaXMgYmx1cnJlZFxuICAgICAgdGhpcy5pbml0aWFsVmFsdWUgPSB0aGlzLmludGVybmFsVmFsdWVcbiAgICB9LFxuICAgIG9uS2V5RG93biAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgdGhpcy4kZW1pdCgna2V5ZG93bicsIGUpXG4gICAgfSxcbiAgICB0cnVuY2F0ZVRleHQgKHN0cjogc3RyaW5nKSB7XG4gICAgICBpZiAoc3RyLmxlbmd0aCA8IE51bWJlcih0aGlzLnRydW5jYXRlTGVuZ3RoKSkgcmV0dXJuIHN0clxuICAgICAgY29uc3QgY2hhcnNLZWVwT25lU2lkZSA9IE1hdGguZmxvb3IoKE51bWJlcih0aGlzLnRydW5jYXRlTGVuZ3RoKSAtIDEpIC8gMilcbiAgICAgIHJldHVybiBgJHtzdHIuc2xpY2UoMCwgY2hhcnNLZWVwT25lU2lkZSl94oCmJHtzdHIuc2xpY2Uoc3RyLmxlbmd0aCAtIGNoYXJzS2VlcE9uZVNpZGUpfWBcbiAgICB9LFxuICB9LFxufSlcbiJdfQ==