/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: "class",
	theme: {},
	plugins: [
		require('vidstack/tailwind.cjs')({
			// Optimize output by specifying player selector.
			selector: '.media-player',
			// Change the media variants prefix.
			prefix: 'media',
			// Enables more efficient selectors.
			webComponents: true,
		  }),
		require('tailwindcss-animate'),
		require('@tailwindcss/typography')
	],
}
