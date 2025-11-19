<script>
	import CalendarOptions from '@/components/calendar/CalendarOptions.svelte';
	import CalendarDisplay from '@/components/calendar/CalendarDisplay.svelte';
</script>

<section id="crear" class="h-svh w-full p-6">
	<div class="grid size-full grid-cols-[30%_1fr] gap-3 rounded-4xl bg-neutral-900 p-6 text-neutral-100">
		<CalendarOptions />
		<CalendarDisplay />
	</div>
</section>

<style>
	section {
		corner-shape: squircle;
	}
</style>
