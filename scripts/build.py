#!/usr/bin/env python3
"""Build an installable extension ZIP using only Python's standard library."""

import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
from zipfile import ZIP_DEFLATED, ZipFile


def main():
    root = Path(__file__).resolve().parents[1]
    metadata = json.loads((root / "metadata.json").read_text(encoding="utf-8"))
    uuid = metadata["uuid"]
    if not re.fullmatch(r"[A-Za-z0-9_.@-]+", uuid):
        raise SystemExit("Invalid extension UUID")
    compiler = shutil.which("glib-compile-schemas")
    if not compiler:
        raise SystemExit("Missing glib-compile-schemas (Ubuntu/Zorin: libglib2.0-bin)")

    runtimes = sorted(root.glob("runtime_*.js"))
    if len(runtimes) != 1 or not re.fullmatch(r"runtime_\d{14}\.js", runtimes[0].name):
        raise SystemExit("Keep exactly one timestamped runtime in the release source")

    files = ["extension.js", "prefs.js", "translation-helper.js", "metadata.json",
             "stylesheet.css", runtimes[0].name, "LICENSE", "CREDITS.md",
             "README.md", "README.en.md"]
    dist = root / "dist"
    dist.mkdir(exist_ok=True)
    archive = dist / f"{uuid}.shell-extension.zip"
    with tempfile.TemporaryDirectory(prefix="fast-translate-build-") as temporary:
        stage = Path(temporary)
        for name in files:
            shutil.copy2(root / name, stage / name)
        for folder in ("icons", "locale"):
            shutil.copytree(root / folder, stage / folder)
        (stage / "schemas").mkdir()
        for schema in (root / "schemas").glob("*.xml"):
            shutil.copy2(schema, stage / "schemas" / schema.name)
        subprocess.run([compiler, "--strict", str(stage / "schemas")], check=True)
        with ZipFile(archive, "w", compression=ZIP_DEFLATED) as package:
            for source in sorted(stage.rglob("*")):
                if source.is_file():
                    package.write(source, source.relative_to(stage).as_posix())
        with ZipFile(archive) as package:
            if package.testzip() is not None:
                raise SystemExit("ZIP integrity verification failed")
    print(archive)


if __name__ == "__main__":
    main()
