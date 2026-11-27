import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from './clipboard';

describe('copyToClipboard', () => {
	let writeText: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.useFakeTimers();
		writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal('navigator', { clipboard: { writeText } });
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it('écrit le texte dans le presse-papiers', async () => {
		vi.stubGlobal('document', { getElementById: () => null });

		await copyToClipboard('https://example.test');

		expect(writeText).toHaveBeenCalledWith('https://example.test');
	});

	it('affiche puis masque l’icône de confirmation après 2 secondes', async () => {
		const icon = { classList: { remove: vi.fn(), add: vi.fn() } };
		vi.stubGlobal('document', { getElementById: (id: string) => (id === 'check-icon' ? icon : null) });

		await copyToClipboard('abc');

		expect(icon.classList.remove).toHaveBeenCalledWith('invisible');
		expect(icon.classList.add).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1999);
		expect(icon.classList.add).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(icon.classList.add).toHaveBeenCalledWith('invisible');
	});

	it('ne plante pas quand l’icône est absente', async () => {
		vi.stubGlobal('document', { getElementById: () => null });

		await expect(copyToClipboard('abc')).resolves.toBeUndefined();
	});

	it('propage l’erreur quand le presse-papiers refuse l’écriture', async () => {
		writeText.mockRejectedValueOnce(new Error('permission refusée'));
		vi.stubGlobal('document', { getElementById: () => null });

		await expect(copyToClipboard('abc')).rejects.toThrow('permission refusée');
	});
});
