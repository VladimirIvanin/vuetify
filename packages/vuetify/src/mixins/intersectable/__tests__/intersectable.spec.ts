import intersectable from "../index";
import { defineComponent, h } from "vue";
import { mount, VueWrapper } from "@vue/test-utils";

describe("intersectable.ts", () => {
  let mountFunction: (options?: any) => VueWrapper<any>;

  beforeEach(() => {
    mountFunction = (options?: any) => {
      return mount(
        defineComponent({
          render: () => h("div"),
          ...options
        })
      );
    };
  });

  it("should call callbacks when element is intersected", () => {
    const callback = jest.fn();

    const wrapper = mountFunction({
      mixins: [intersectable({ onVisible: ["callback"] })],
      methods: { callback }
    });

    expect(callback).not.toHaveBeenCalled();

    wrapper.vm.onObserve(
      [] as IntersectionObserverEntry[],
      (null as any) as IntersectionObserver,
      false
    );

    expect(callback).not.toHaveBeenCalled();

    wrapper.vm.onObserve(
      [] as IntersectionObserverEntry[],
      (null as any) as IntersectionObserver,
      true
    );

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
