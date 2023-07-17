import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import cc from 'classcat';
import { HasSlotController } from '@mdui/shared/controllers/has-slot.js';
import { booleanConverter } from '@mdui/shared/helpers/decorator.js';
import { nothingTemplate } from '@mdui/shared/helpers/template.js';
import { uniqueId } from '@mdui/shared/helpers/uniqueId.js';
import { componentStyle } from '@mdui/shared/lit-styles/component-style.js';
import { FocusableMixin } from '@mdui/shared/mixins/focusable.js';
import '../icon.js';
import { RippleMixin } from '../ripple/ripple-mixin.js';
import { tabStyle } from './tab-style.js';
import type { Ripple } from '../ripple/index.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Ref } from 'lit/directives/ref.js';

/**
 * @event click - 点击时触发
 * @event focus - 获得焦点时触发
 * @event blur - 失去焦点时触发
 *
 * @slot - 选项卡导航项的文本
 * @slot icon - 选项卡导航项中的图标
 * @slot badge - 徽标
 * @slot custom - 自定义整个选项卡导航项中的内容
 *
 * @csspart container - 选项卡导航项容器
 * @csspart icon-container - 选项卡导航项中的图标容器
 * @csspart icon - 选项卡导航项中的图标
 * @csspart label-container - 选项卡导航项的文本
 */
@customElement('mdui-tab')
export class Tab extends RippleMixin(FocusableMixin(LitElement)) {
  public static override styles: CSSResultGroup = [componentStyle, tabStyle];

  /**
   * 该选项卡导航项的值
   */
  @property({ reflect: true })
  public value?: string;

  /**
   * Material Icons 图标名
   */
  @property({ reflect: true })
  public icon?: string;

  /**
   * 是否把图标和文本水平排列
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  public inline = false;

  /**
   * 是否为激活状态，由 `<mdui-tabs>` 组件控制该参数
   */
  @property({
    type: Boolean,
    reflect: true,
    converter: booleanConverter,
  })
  protected active = false;

  /**
   * 选项卡形状。由 `<mdui-tabs>` 组件控制该参数
   */
  @property({ reflect: true })
  protected variant: 'primary' | 'secondary' = 'primary';

  // 每一个 `<mdui-tab>` 元素都添加一个唯一的 key
  protected readonly key = uniqueId();

  private readonly rippleRef: Ref<Ripple> = createRef();
  private readonly hasSlotController = new HasSlotController(
    this,
    'icon',
    'custom',
  );

  protected override get rippleElement() {
    return this.rippleRef.value!;
  }

  protected override get rippleDisabled(): boolean {
    return false;
  }

  protected override get focusElement(): HTMLElement {
    return this;
  }

  protected override get focusDisabled(): boolean {
    return false;
  }

  protected override render(): TemplateResult {
    const hasIconSlot = this.hasSlotController.test('icon');
    const hasCustomSlot = this.hasSlotController.test('custom');

    const renderBadge = (): TemplateResult => html`<slot name="badge"></slot>`;

    return html`<mdui-ripple
        ${ref(this.rippleRef)}
        .noRipple=${this.noRipple}
      ></mdui-ripple>
      <div part="container" class="container ${cc({ preset: !hasCustomSlot })}">
        <slot name="custom">
          <div part="icon-container" class="icon-container">
            ${when(hasIconSlot || this.icon, renderBadge)}
            <slot name="icon">
              ${this.icon
                ? html`<mdui-icon
                    part="icon"
                    class="icon"
                    name=${this.icon}
                  ></mdui-icon>`
                : nothingTemplate}
            </slot>
          </div>
          <div part="label-container" class="label-container">
            ${when(!hasIconSlot && !this.icon, renderBadge)}
            <slot></slot>
          </div>
        </slot>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mdui-tab': Tab;
  }
}
