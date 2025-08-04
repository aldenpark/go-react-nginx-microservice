package utils

func CpuStatus(percent float64) string {
	switch {
	case percent < 50:
		return "healthy"
	case percent < 80:
		return "warn"
	default:
		return "critical"
	}
}
