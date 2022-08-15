// There is one thing that can still only be implemented using classes: Error boundaries.
// There is just no functional equivalent for componentDidCatch and deriveStateFromError yet.
// https://reactjs.org/docs/hooks-faq.html#do-hooks-cover-all-use-cases-for-classes
import React from 'react'

type ErrorHandlingComponent<Props> = (
  props: Props,
  error?: Error,
  errorInfo?: React.ErrorInfo
) => React.ReactNode
type ErrorState = { error?: Error; errorInfo?: React.ErrorInfo }

// eslint-disable-next-line @typescript-eslint/ban-types
export default function Catch<Props extends {}>(
  component: ErrorHandlingComponent<Props>
): React.ComponentType<Props> {
  return class extends React.Component<Props, ErrorState> {
    state: ErrorState = {
      error: undefined,
      errorInfo: undefined,
    }

    static getDerivedStateFromError(error: Error) {
      return { error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      this.setState({ errorInfo })
    }

    render() {
      return component(this.props, this.state.error, this.state.errorInfo)
    }
  }
}
