"""Room availability checker."""


def can_book(start, end, now, blocked, existing):
    """Return True if a booking from start to end may be made, else False.

    Times are integer minutes after midnight. Intervals are half-open
    [start, end), so intervals that only touch at an endpoint do not overlap.

    Args:
        start: Requested start minute.
        end: Requested end minute.
        now: Current minute (assumed valid, 0-1439).
        blocked: If truthy, every request is rejected.
        existing: list of (start, end) tuples for existing bookings.
            Entries are assumed well-formed (s < e). Not modified.

    Returns:
        bool: True only when the request satisfies every rule.
    """
    # AC3: a blocked room rejects every request.
    if blocked:
        return False

    # AC1: 0 <= start < end <= 1440, and start strictly after now.
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: duration must not exceed 120 minutes (exactly 120 is allowed).
    if end - start > 120:
        return False

    # AC4: reject any overlap with an existing interval; touching is allowed.
    for s, e in existing:
        if start < e and s < end:
            return False

    # AC5: all checks passed; inputs were only read, never modified.
    return True
