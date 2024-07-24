<template>
  <button class="button">
    <span class="button-content">
      <slot />
    </span>
  </button>
</template>

<style lang="scss">
.button {
  padding: 4px 12px;
  border: none;
  border-radius: 2px;
  background: var(--color-primary-blue2);
  color: var(--color-foreground3);
  font-family: inherit;

  &:hover {
    background: var(--color-primary-blue3);
  }

  &:active {
    background: var(--color-primary-blue1);
  }

  &:disabled {
    background: var(--color-primary-blue1);

    .button-content {
      color: var(--app-foreground1);
      cursor: not-allowed;
    }
  }
}
</style>
