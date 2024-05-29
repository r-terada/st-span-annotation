import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode, MouseEvent } from "react"

interface Span {
  start: number
  end: number
  label: string
  text: string
}

interface State {
  selectedLabel: string | null
  spans: Span[]
  colorMap: { [key: string]: string }
}

class MyComponent extends StreamlitComponentBase<State> {
  public state: State = {
    selectedLabel: null,
    spans: [],
    colorMap: {}
  }

  public componentDidMount() {
    this._initializeColorMap()
    this._initializeSpans()
  }

  public render = (): ReactNode => {
    const { text, labels } = this.props.args
    const theme = this.props.theme || { primaryColor: 'gray' }
    const style: React.CSSProperties = {}

    style.border = `1px solid ${this.state.selectedLabel ? theme.primaryColor : "gray"}`

    return (
      <div>
        <div>
          {labels && labels.map((label: string) => (
            <button
              key={label}
              onClick={() => this._selectLabel(label)}
              style={{
                margin: '5px',
                border: `1px solid ${this._getLabelColor(label)}`,
                boxShadow: `0 4px 0 ${this._getLabelColor(label)}`,
                borderRadius: '5px'
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div
          style={{ marginTop: '20px', padding: '10px', border: '1px solid gray', whiteSpace: 'pre-wrap', position: 'relative' }}
          onMouseUp={(e) => this._handleMouseUp(e, text)}
        >
          {this._renderTextWithSpans(text)}
        </div>
      </div>
    )
  }


  private _initializeColorMap = (): void => {
    const { labels, color_palette } = this.props.args
    const defaultColors = ['lightblue', 'lightgreen', 'lightpink', 'lightcoral', 'lightgoldenrodyellow']
    const colorMap: { [key: string]: string } = {}

    if (labels) {
      labels.forEach((label: string, index: number) => {
        colorMap[label] = color_palette?.[label] || defaultColors[index % defaultColors.length]
      })
    }

    this.setState({ colorMap })
  }

  private _initializeSpans = (): void => {
    const { spans } = this.props.args
    if (spans) {
      // spansをJavaScriptのSpanインターフェースに変換
      const convertedSpans: Span[] = spans.map((span: any) => ({
        start: span.start,
        end: span.end,
        label: span.label,
        text: span.text
      }))
      this.setState({ spans: convertedSpans }, () => {
        Streamlit.setComponentValue(this.state.spans);
      });
    }
  }

  private _returnInitialSpans = (): void => {
    const { spans } = this.state;
    if (spans && spans.length > 0) {
      Streamlit.setComponentValue(spans);
    }
  }

  private _selectLabel = (label: string): void => {
    this.setState({ selectedLabel: label })
  }

  private _handleMouseUp = (event: MouseEvent<HTMLDivElement>, text: string): void => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      let start = range.startOffset
      let end = range.endOffset

      const startNode = range.startContainer
      const endNode = range.endContainer

      if (startNode && endNode) {
        let nodeText = ''
        if (startNode === endNode) {
          nodeText = startNode.textContent || ''
        } else {
          const fragment = range.cloneContents()
          const div = document.createElement('div')
          div.appendChild(fragment)
          nodeText = div.innerText
        }

        let subText = nodeText.substring(start, end)

        const trimmedText = subText.trim()
        const leadingWhitespaceLength = subText.length - subText.trimStart().length
        const trailingWhitespaceLength = subText.length - subText.trimEnd().length

        start += leadingWhitespaceLength
        end -= trailingWhitespaceLength

        if (trimmedText) {
          const startIndex = text.indexOf(trimmedText, start)
          const endIndex = startIndex + trimmedText.length

          this.setState(prevState => {
            const overlappingSpanIndex = prevState.spans.findIndex(span => !(span.end <= startIndex || span.start >= endIndex))
            let newSpans
            if (overlappingSpanIndex >= 0) {
              newSpans = prevState.spans.filter((_, idx) => idx !== overlappingSpanIndex)
            } else {
              const newSpan: Span = { start: startIndex, end: endIndex, label: this.state.selectedLabel!, text: trimmedText }
              newSpans = [...prevState.spans, newSpan].sort((a, b) => a.start - b.start)
            }
            Streamlit.setComponentValue(newSpans)
            return { spans: newSpans }
          })
        }
      }
    }
  }

  private _handleLabelChange = (index: number, newLabel: string): void => {
    this.setState(prevState => {
      const spans = [...prevState.spans]
      spans[index].label = newLabel
      Streamlit.setComponentValue(spans)
      return { spans }
    })
  }

  private _renderTextWithSpans = (text: string): ReactNode => {
    const { spans } = this.state
    if (spans.length === 0) {
      return <span>{text}</span>
    }

    const elements: ReactNode[] = []
    let lastIndex = 0

    spans.forEach((span, index) => {
      if (span.start > lastIndex) {
        elements.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, span.start)}</span>)
      }

      const spanText = text.substring(span.start, span.end)
      const lines = spanText.split('\n')
      lines.forEach((line, lineIndex) => {
        if (lineIndex > 0) {
          elements.push(<br key={`br-${index}-${lineIndex}`} />)
        }
        elements.push(
          <span key={`span-${index}-${lineIndex}`} style={{ display: 'inline-block', position: 'relative' }}>
            <mark style={{ backgroundColor: this._getLabelColor(span.label), display: 'inline-block' }}>
              {line}
            </mark>
            {lineIndex === lines.length - 1 && (
              <select
                value={span.label}
                onChange={(e) => this._handleLabelChange(index, e.target.value)}
                style={{
                  border: 'none',
                  fontSize: '0.8em',
                  padding: '2px',
                  cursor: 'pointer',
                  display: 'inline-block',
                  marginLeft: '5px',
                  boxShadow: `0 4px 0 ${this._getLabelColor(span.label)}`,
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  color: 'black'
                }}
              >
                {this.props.args.labels.map((label: string) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            )}
          </span>
        )
      })

      lastIndex = span.end
    })

    if (lastIndex < text.length) {
      elements.push(<span key={`text-end`}>{text.substring(lastIndex)}</span>)
    }

    return elements
  }

  private _getLabelColor = (label: string): string => {
    return this.state.colorMap[label] || 'lightgray'
  }
}

export default withStreamlitConnection(MyComponent)
