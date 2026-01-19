# Cortex TMS Demo - Status & Migrate Workflow
# Generated with VHS (https://github.com/charmbracelet/vhs)
# To generate: vhs assets/demo.tape

# VHS Configuration
Output assets/demo.gif
Set Shell "bash"
Set FontSize 14
Set Width 1200
Set Height 600
Set Theme "Dracula"
Set TypingSpeed 50ms
Set PlaybackSpeed 0.8

# Initial setup
Type "# Cortex TMS Demo - Project Dashboard & Migration" Sleep 500ms Enter
Sleep 1s

# Show cortex status
Type "cortex status" Sleep 500ms Enter
Sleep 3s

# Clear for next command
Sleep 1s
Type "clear" Enter
Sleep 500ms

# Show cortex migrate
Type "cortex migrate" Sleep 500ms Enter
Sleep 3s

# Final pause
Sleep 2s
