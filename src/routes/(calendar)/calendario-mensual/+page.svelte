<script lang="ts">
	import OutlineRow from '@/components/OutlineRow.svelte';
	import Link from '@/components/Link.svelte';
</script>

<section id="hero" class="flex flex-col gap-4">
	<OutlineRow className="pt-4 md:pt-16 pb-4 md:pb-8 gap-6 flex flex-col border-t-0">
		<OutlineRow className="px-6">
			<h1
				class="text-5xl leading-none text-neutral-900 md:text-[5.5rem] dark:text-neutral-50"
			>
				Calendario <span
					class="font-medium text-blue-800 dark:text-blue-500 [&>span>span]:font-normal"
				>
					mensual
				</span>
				<br /> personalizable
			</h1>
		</OutlineRow>

		<OutlineRow className="px-6">
			<p class="max-w-5xl md:text-xl">
				Calendarios personalizados anuales, mensuales, laborables, festivos, santuario...
				Ademas horaraios, listas, meal planners y mucho más.
			</p>
		</OutlineRow>

		<OutlineRow className="px-6 py-2">
			<Link href="#crear">Crear calendario</Link>
		</OutlineRow>
	</OutlineRow>
</section>
