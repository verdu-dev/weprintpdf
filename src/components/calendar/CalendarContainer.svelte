<script>
	import CalendarOptions from '@/components/calendar/CalendarOptions.svelte';
	import CalendarDisplay from '@/components/calendar/CalendarDisplay.svelte';
</script>

<section id="crear" class="h-svh w-full p-6 squircle">
	<div class="grid size-full grid-cols-[350px_1fr] gap-3 rounded-4xl">
		<CalendarOptions />
		<CalendarDisplay />
	</div>
</section>
