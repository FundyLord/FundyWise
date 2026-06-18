from pathlib import Path
import sys

BUILD_DIR = Path(__file__).resolve().parent.parent / "build"

if str(BUILD_DIR) not in sys.path:
    sys.path.insert(0, str(BUILD_DIR))

import debt_optimizer


def minimize_transactions(expenses: list[dict]):
    return debt_optimizer.minimize_transactions(expenses)