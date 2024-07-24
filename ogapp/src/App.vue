<script lang="ts">
import { defineComponent } from 'vue'
import Header from './components/Header.vue'
import TextField from './components/TextField.vue'
import Card from './components/Card.vue'
import Button from './components/Button.vue'
import './index.css'

export default defineComponent({
  components: {
    Header,
    TextField,
    Card,
    Button
  }
})
</script>

<template>
  <Header />
  <main class="main">
    <h1 class="heading1">Welcome to the coding challenge</h1>
    <p>Please take a look at the <code>README.md</code> file for instructions on how to complete this task.</p>
    <p>
      In the interest of saving you some time, we have provided a working Vue app with a few components to get you
      started.
    </p>
    <p>Feel free to use them and change them as you need.</p>
    <ul class="component-list">
      <li>
        <p><code>TextField</code></p>
        <TextField placeholder="Placeholder" />
      </li>
      <li>
        <p><code>Card</code></p>
        <Card>
          <p>Generic card content</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ex, totam ducimus quam eligendi quasi
            laborum optio, tenetur, aperiam reprehenderit voluptates? A velit quia inventore amet excepturi pariatur
            praesentium. Quibusdam.
          </p>
        </Card>
      </li>
      <li>
        <p><code>Button</code></p>
        <Button>Button Label</Button>
      </li>
    </ul>
  </main>
</template>

<style>
#app {
  font-family: var(--font-regular);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main {
  max-width: var(--max-width);
  margin: 0 auto;
}

.heading1 {
  font-family: var(--font-bold);
}

.component-list {
  padding: 0 0 0 12px;
}
</style>
