/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: "class",
	theme: {},
	plugins: [
		require('tailwindcss-animate'),
		require('vidstack/tailwind.cjs')({
			prefix: 'media',
			webComponents: true,
		  }),
		require('@tailwindcss/typography')
	],
}
