package main

import (
	"log"
	"os"
	"path/filepath"

	"backend/config"
	"backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	r := gin.Default()

	// API routes
	routes.RegisterHealthRoutes(r.Group("/api"), cfg)

	// Static file serving
	r.NoRoute(func(c *gin.Context) {
		requested := filepath.Join(cfg.StaticDir, c.Request.URL.Path)
		if fi, err := os.Stat(requested); err == nil && !fi.IsDir() {
			c.File(requested)
		} else {
			c.File(filepath.Join(cfg.StaticDir, "index.html"))
		}
	})

	log.Printf("Backend listening on :%s", cfg.Port)
	r.Run(":" + cfg.Port)
}
