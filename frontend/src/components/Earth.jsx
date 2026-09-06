import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'

export default function Earth({
  className = '',
  theta = 0.25,
  dark = 1,
  scale = 1.1,
  diffuse = 1.2,
  mapSamples = 16000,
  mapBrightness = 6,
  baseColor = [0.19, 0.44, 0.93],
  markerColor = [1, 0.42, 0.42],
  glowColor = [0.29, 0.51, 0.85],
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    let width = 0
    let phi = 0
    let globe
    let animationFrameId
    let setupFrameId

    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
    window.addEventListener('resize', onResize)
    onResize()

    // Deferred by a frame: in React StrictMode dev double-mount, this lets
    // the first pass's cleanup (globe.destroy()) fully release the WebGL
    // context before the second pass creates a new one on the same canvas
    // — creating two contexts back-to-back on one canvas corrupts the
    // render (looks like erratic multi-axis rotation instead of a clean spin).
    setupFrameId = requestAnimationFrame(() => {
      if (cancelled || !canvasRef.current) return

      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta,
        dark,
        scale,
        diffuse,
        mapSamples,
        mapBrightness,
        baseColor,
        markerColor,
        glowColor,
        opacity: 1,
        offset: [0, 0],
        markers: [],
      })

      const animate = () => {
        phi += 0.006
        globe.update({ phi })
        animationFrameId = requestAnimationFrame(animate)
      }
      animationFrameId = requestAnimationFrame(animate)
    })

    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(setupFrameId)
      cancelAnimationFrame(animationFrameId)
      globe?.destroy()
    }
  }, [theta, dark, scale, diffuse, mapSamples, mapBrightness, baseColor, markerColor, glowColor])

  return (
    <div className={`z-10 mx-auto flex w-full max-w-[520px] items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', maxWidth: '100%', aspectRatio: '1' }}
      />
    </div>
  )
}
