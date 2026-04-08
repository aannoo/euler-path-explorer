import { describe, it, expect, beforeEach, vi } from 'vitest';

let on;
let off;
let setupEvents;

const loadEventsModule = async () => {
  vi.resetModules();
  ({ on, off, setupEvents } = await import('./events.js'));
};

describe('Event Utils', () => {
  const createElement = () => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  });

  beforeEach(async () => {
    vi.stubGlobal('document', {
      querySelector: vi.fn(() => null)
    });
    await loadEventsModule();
  });

  it('attaches handlers directly to elements', () => {
    const element = createElement();
    const handler = vi.fn();

    const id = on(element, 'click', handler);

    expect(id).toMatch(/^click:/);
    expect(element.addEventListener).toHaveBeenCalledWith('click', handler);
  });

  it('resolves selector strings through the DOM helper', async () => {
    const element = createElement();
    globalThis.document.querySelector.mockReturnValue(element);
    const handler = vi.fn();

    const id = on('#save', 'click', handler);

    expect(id).toMatch(/^click:/);
    expect(globalThis.document.querySelector).toHaveBeenCalledWith('#save');
    expect(element.addEventListener).toHaveBeenCalledWith('click', handler);
  });

  it('returns null when an element cannot be found', () => {
    expect(on('#missing', 'click', vi.fn())).toBeNull();
  });

  it('removes registered handlers by id', () => {
    const element = createElement();
    const handler = vi.fn();
    const id = on(element, 'click', handler);

    expect(off(id)).toBe(true);
    expect(element.removeEventListener).toHaveBeenCalledWith('click', handler);
    expect(off(id)).toBe(false);
  });

  it('setupEvents wires multiple handlers and cleans them up', () => {
    const saveButton = createElement();
    const cancelButton = createElement();

    globalThis.document.querySelector.mockImplementation((selector) => {
      if (selector === '#save') return saveButton;
      if (selector === '#cancel') return cancelButton;
      return null;
    });

    const cleanup = setupEvents({
      '#save': {
        click: vi.fn(),
        focus: vi.fn()
      },
      '#cancel': {
        click: vi.fn()
      },
      '#missing': {
        blur: vi.fn()
      }
    });

    expect(saveButton.addEventListener).toHaveBeenCalledTimes(2);
    expect(cancelButton.addEventListener).toHaveBeenCalledTimes(1);

    cleanup();

    expect(saveButton.removeEventListener).toHaveBeenCalledTimes(2);
    expect(cancelButton.removeEventListener).toHaveBeenCalledTimes(1);
  });
});
