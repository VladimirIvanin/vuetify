import { defineComponent, h } from "vue";
import Menuable from "../";
import { mount, MountingOptions, VueWrapper } from "@vue/test-utils";
import VApp from "../../../components/VApp";

describe("menuable.ts", () => {
  const Mock = defineComponent({
    mixins: [Menuable],
    render() {
      return h("div");
    }
  });

  type Instance = InstanceType<typeof Mock>;
  let mountFunction: (options?: MountingOptions<any>) => VueWrapper<any>;

  beforeEach(() => {
    mountFunction = (options?: MountingOptions<any>) => {
      return mount(Mock, {
        global: {
          mocks: {
            $vuetify: {
              theme: {},
              rtl: false
            }
          }
        },
        ...options
      });
    };
  });

  it("should bind custom activator", () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        activator: "body"
      }
    });

    expect(wrapper.vm.getActivator()).toBeTruthy();
  });

  it("should update dimensions when activated", async () => {
    const sneakPeek = jest.fn();
    const MockWithMethod = defineComponent({
      mixins: [Menuable],
      methods: {
        sneakPeek
      },
      render() {
        return h("div");
      }
    });

    const wrapper = mount(MockWithMethod, {
      global: {
        mocks: {
          $vuetify: {
            theme: {},
            rtl: false
          }
        }
      }
    });

    wrapper.vm.updateDimensions();
    await wrapper.vm.$nextTick();
    expect(sneakPeek).toHaveBeenCalled();
  });

  it("should apply maxWidth in left calculations when offset", async () => {
    const wrapper = mountFunction({
      props: {
        attach: true,
        left: true,
        offsetX: true,
        maxWidth: 200
      }
    });

    // Настраиваем размеры для правильного тестирования
    wrapper.vm.dimensions = {
      activator: { 
        width: 100, 
        offsetLeft: 0,
        left: 0 
      },
      content: { 
        width: 300 
      }
    };

    // Мокаем pageWidth для создания сценария переполнения
    wrapper.vm.pageWidth = 250;

    await wrapper.vm.$nextTick();

    // При left: true, offsetX: true и maxWidth: 200
    // computedLeft должен быть: 0 - (300 - 100) + (-200) = -400
    // Но с учетом calcXOverflow это должно дать -200
    expect(wrapper.vm.computedLeft).toBe(-200);
  });

  it("should have the correct position non attached", async () => {
    const AppComponent = defineComponent({
      render() {
        return h(
          VApp,
          {},
          {
            default: () => h(Mock)
          }
        );
      }
    });

    const wrapper = mount(AppComponent, {
      global: {
        mocks: {
          $vuetify: {
            theme: {},
            rtl: false
          }
        }
      }
    });

    await wrapper.vm.$nextTick();

    const mockComponent = wrapper.findComponent(Mock);
    const vm = mockComponent.vm;

    Object.assign(vm.dimensions.activator, { top: 100, left: 80 });
    Object.assign(vm.dimensions.content, { width: 300, height: 50 });

    await wrapper.vm.$nextTick();

    expect(vm.computedTop).toBe(100);
    expect(vm.computedLeft).toBe(80);
  });
});
