package config

import "os"

type AppConfig struct {
	Port      string
	StaticDir string
	Version   string
}

func Load() AppConfig {
	return AppConfig{
		Port:      getEnv("API_PORT", "8080"),
		StaticDir: getEnv("STATIC_DIR", "/usr/share/nginx/html"),
		Version:   getEnv("APP_VERSION", "v0.1.0-dev"),
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
