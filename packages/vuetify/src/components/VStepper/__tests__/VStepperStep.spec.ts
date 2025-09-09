// Components
import VStepperStep from '../VStepperStep'

// Utilities
import {
  mount,
  Wrapper,
  MountOptions,
  enableAutoUnmount,
} from '@vue/test-utils'

const tip = '[Vuetify] The v-stepper-step component must be used inside a v-stepper'
const warning = '[Vue warn]: Injection "stepClick" not found'

describe('VStepperStep.ts', () => {
  type Instance = InstanceType<typeof VStepperStep>
  let mountFunction: (options?: MountOptions<Instance>) => Wrapper<Instance>

  enableAutoUnmount(afterEach)

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VStepperStep, {
        global: {
          mocks: {
            $vuetify: {
              icons: {
                values: {
                  complete: 'mdi-check',
                },
              },
            },
          },
          provide: {
            stepClick: jest.fn(),
            stepper: {
              register: jest.fn(),
              unregister: jest.fn(),
            },
          },
        },
        ...options,
      })
    }
  })

  it('should accept a custom color', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        color: 'pink',
        complete: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should accept a custom css color', async () => {
    const wrapper = mountFunction({
      attachTo: document.body,
      props: {
        color: '#aabbcc',
        complete: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should emit event and invoke stepClick when clicked', async () => {
    const stepClick = jest.fn()
    const wrapper = mountFunction({
      props: {
        editable: true,
      },
      global: {
        provide: {
          stepClick,
          stepper: {
            register: jest.fn(),
            unregister: jest.fn(),
          },
        },
      },
    })

    await wrapper.find('.v-stepper__step--editable').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(stepClick).toHaveBeenCalledWith(wrapper.vm.step)
  })

  it('should render', async () => {
    const wrapper = mountFunction({
      props: {
        step: 1,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render complete step', async () => {
    const wrapper = mountFunction({
      props: {
        complete: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render step with error', async () => {
    const wrapper = mountFunction({
      props: {
        rules: [() => 'Error message'],
      },
      global: {
        provide: {
          stepClick: jest.fn(),
          stepper: {
            register: jest.fn(),
            unregister: jest.fn(),
          },
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render editable step', async () => {
    const wrapper = mountFunction({
      props: {
        editable: true,
        complete: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should toggle', async () => {
    const wrapper = mountFunction({
      props: {
        step: 3,
      },
    })

    wrapper.vm.toggle(1)
    expect(wrapper.vm.isActive).toBeFalsy()
    expect(wrapper.vm.isInactive).toBeTruthy()

    wrapper.vm.toggle(3)
    expect(wrapper.vm.isActive).toBeTruthy()
    expect(wrapper.vm.isInactive).toBeFalsy()

    wrapper.vm.toggle(5)
    expect(wrapper.vm.isActive).toBeFalsy()
    expect(wrapper.vm.isInactive).toBeFalsy()
  })
})
