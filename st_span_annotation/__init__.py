import os
from typing import TypedDict
import streamlit.components.v1 as components

_RELEASE = os.getenv("RELEASE", "false").lower() == "true"

if not _RELEASE:
    _component_func = components.declare_component(
        "st_span_annotation",
        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("st_span_annotation", path=build_dir)


class Span(TypedDict):
    start: int
    end: int
    label: str
    text: str


def st_span_annotation(
    text: str,
    labels: list[str],
    color_palette: dict[str, str] = None,
    key: str = None,
    **kwargs
) -> Span:
    component_value = _component_func(
        text=text, labels=labels, color_palette=color_palette, key=key, **kwargs
    )
    return component_value
