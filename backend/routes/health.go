package routes

import (
	"backend/config"
	"backend/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterHealthRoutes(rg *gin.RouterGroup, cfg config.AppConfig) {
	rg.GET("/health", handlers.HealthHandler(cfg))
}
