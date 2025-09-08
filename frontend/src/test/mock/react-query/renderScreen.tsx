import { render } from '@testing-library/react'
import { ReactQueryProvider } from '@/presentation/providers/react-query'

export const renderView = (Element: React.ReactElement) => {
	return render(<ReactQueryProvider>{Element}</ReactQueryProvider>)
}
