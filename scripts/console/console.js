var DebugConsole=
{
	mostrarConsola: function()
	{
		$('#consola').show();
		$('#mostrarconsola').hide();
	},
	
	ocultarConsola:function ()
	{
		$('#consola').hide();
		$('#mostrarconsola').show();
	},
	
	log:function(msg)
	{
		var node=document.createElement("DIV");
		var textnode=document.createTextNode(msg);
		node.appendChild(textnode);
		document.getElementById("mensajeconsola").appendChild(node);
		while(document.getElementById("mensajeconsola").childNodes.length>15)
		{	
			document.getElementById("mensajeconsola").removeChild(document.getElementById("mensajeconsola").firstChild);
		}
	},
	
	limpiar :function()
	{
		document.getElementById("mensajeconsola").innerHTML="";
	}
}