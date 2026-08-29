export function setElementProps(node: HTMLElement, props: Record<string, unknown>) {
	let currentProps = props;
	const applyProps = () => Object.assign(node, currentProps);

	void customElements.whenDefined(node.localName).then(applyProps);

	return {
		update(nextProps: Record<string, unknown>) {
			currentProps = nextProps;
			if (customElements.get(node.localName)) applyProps();
		}
	};
}
