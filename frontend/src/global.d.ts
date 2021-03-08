declare global {
	interface String {
		parseNumbers(): number;
	}

	interface Error {
		toJSON(): Object;
	}

	interface JQueryStatic {
		notify: (
			content: { icon: string; message: string },
			options: { type: ColorTypes; timer: number; placement: { from: NotifyFrom; align: NotifyAlign } }
		) => void;
	}

	interface Window {
		$: JQueryStatic;
	}
}

export {};
