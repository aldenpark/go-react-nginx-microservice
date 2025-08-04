package handlers

import (
	"net/http"
	"time"

	"backend/config"
	"backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/shirou/gopsutil/v3/cpu"
)

func HealthHandler(cfg config.AppConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		cpuPercent, err := cpu.Percent(time.Second, false)
		cpuLoad := 0.0
		if err == nil && len(cpuPercent) > 0 {
			cpuLoad = cpuPercent[0]
		}

		c.JSON(http.StatusOK, gin.H{
			"status":      "ok",
			"cpu":         utils.CpuStatus(cpuLoad),
			"cpu_percent": cpuLoad,
			"db":          "ok", // Stubbed
			"version":     cfg.Version,
		})
	}
}
