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

# Hide all setup from recording
Hide

# Set a clean, generic prompt (no real paths shown)
Type "export PS1='$ '" Enter
Sleep 200ms
Type "cd /home/jma/repos-ubuntu/github/cortex-tms" Enter
Sleep 200ms

# Clear screen to hide setup commands
Type "clear" Enter
Sleep 1s

# Start showing from here (screen is now clean)
Show

# Initial setup
Type "# Cortex TMS Demo - Project Dashboard & Migration" Sleep 500ms Enter
Sleep 1s

# Show cortex status (using node directly to avoid global install requirement)
Type "node bin/cortex.js status" Sleep 500ms Enter
Sleep 4s

# Clear for next command
Sleep 1s
Type "clear" Enter
Sleep 500ms

# Show cortex migrate (using node directly)
Type "node bin/cortex.js migrate" Sleep 500ms Enter
Sleep 4s

# Final pause
Sleep 2s
