import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebounce } from "@/hooks/use-debounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("a", 400));

    expect(result.current).toBe("a");
  });

  it("only updates after the delay has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    // The value does not change synchronously with the input.
    expect(result.current).toBe("a");

    // Still unchanged just before the delay completes.
    act(() => {
      vi.advanceTimersByTime(399);
    });
    expect(result.current).toBe("a");

    // Crossing the threshold flushes the new value.
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("b");
  });

  it("resets the timer on rapid changes so only the last value wins", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // A second change before the delay restarts the countdown.
    rerender({ value: "c" });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("c");
  });
});
