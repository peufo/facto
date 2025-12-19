<script lang="ts">
	import { Drawer, Form } from 'fuma'
	import { modelCommit } from '$lib/model'
	import type { Commit } from '$lib/server/prisma'

	let { commit }: { commit?: Commit } = $props()
</script>

<Drawer
	maxWidth="20em"
	noOverlay
	key="form_commit"
	title="{commit ? 'Edit' : 'New'} commit"
	let:close
	class="m-2 rounded-lg border"
>
	<Form
		action="/process?/commit"
		model={modelCommit}
		data={commit}
		on:success={() => close()}
		fields={[
			[
				{
					key: 'name',
					colSpan: 4,
					text: { label: 'Name', input: { autocomplete: 'off', autofocus: true } }
				},
				{ key: 'width', number: { label: 'Size X', value: 60 } },
				{ key: 'height', number: { label: 'Size Y', value: 60 } },
				{ key: 'x', number: { label: 'Pos. relative X', value: 10 } },
				{ key: 'y', number: { label: 'Pos. relative Y', value: 10 } }
			]
		]}
	>
		<input type="hidden" name="path" value="" />
		<input type="hidden" name="nodeId" value="" />
		<!-- <input type="hidden" name="validFrom" value="">
		<input type="hidden" name="validTo" value=""> -->
	</Form>
</Drawer>
