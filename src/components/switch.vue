<template>
  <label class="container">
    <input
      class="input"
      v-bind="$attrs"
      type="checkbox"
      :checked="checked"
      @change="$emit('update:checked', $event.target.checked)"
    />
    <span class="switch"></span>
  </label>
</template>

<script>
export default {
  name: "Switch",
  inheritAttrs: false,
  props: {
    checked: Boolean,
  },
};
</script>

<style scoped>
.container {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.label {
  margin-left: 12px;
  color: #1a202c;
}

.input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.switch {
  --light-gray: #e2e8f0;
  --gray: #cbd5e0;
  --dark-gray: #a0aec0;
  --purple: #89558d;
  --dark-purple: #6b3c6f;

  --switch-container-width: 50px;
  --switch-size: calc(var(--switch-container-width) / 2);
  /* Vertically center the inner circle */
  display: flex;
  align-items: center;
  position: relative;
  height: var(--switch-size);
  flex-basis: var(--switch-container-width);
  /* Make the container element rounded */
  border-radius: var(--switch-size);
  background-color: var(--light-gray);
  transition: background-color 0.25s ease-in-out;
  flex-shrink: 0;
}

.switch::before {
  content: "";
  position: absolute;
  /* Move a little bit the inner circle to the right */
  left: 1px;
  height: calc(var(--switch-size) - 4px);
  width: calc(var(--switch-size) - 4px);
  /* Make the inner circle fully rounded */
  border-radius: 9999px;
  background-color: white;
  transition: transform 0.375s ease-in-out;
  border: 2px solid var(--light-gray);
  border-color: var(--dark-gray);
}

.input:checked + .switch {
  background-color: var(--purple);
}

.input:checked + .switch::before {
  border-color: var(--purple);
  /* Move the inner circle to the right */
  transform: translateX(
    calc(var(--switch-container-width) - var(--switch-size))
  );
}

.input:focus + .switch::before {
  border-color: var(--dark-purple);
}

.input:focus:checked + .switch::before {
  border-color: var(--dark-purple);
}

.input:disabled + .switch {
  background-color: var(--gray);
}

.input:disabled + .switch::before {
  background-color: var(--dark-gray);
  border-color: var(--dark-gray);
}
</style>