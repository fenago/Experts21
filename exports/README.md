# Exports

Standalone Claude skills packaged from the project's agents, ready to upload to a Claude account (**Customize > Skills > upload the .zip**).

| File | What it is |
|---|---|
| `victor-real-estate-advisor.zip` | Victor, the real-estate advisor: personality, instructions, his 10 methods, his knowledge files, and the research pack |
| `victor-real-estate-advisor/` | The same package unzipped, for review |

Rebuild after changing the agent, its skills, its knowledge folder, or `docs/`:

```bash
python3 scripts/export_agent_skill.py real-estate-advisor victor-real-estate-advisor
```

The same script can package any other agent: `python3 scripts/export_agent_skill.py <agent-name> <export-name> ["optional description"]`. Without a description argument it uses the agent's own description.

Anything in these files is uploaded to your Claude account, so check the knowledge folder for sensitive documents before uploading.
