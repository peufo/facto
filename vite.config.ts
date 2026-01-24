import devtoolsJson from 'vite-plugin-devtools-json'
import { defineConfig } from 'vitest/config'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), devtoolsJson()],
	test: { include: ['src/**/*.{test,spec}.{js,ts}'] }
})
